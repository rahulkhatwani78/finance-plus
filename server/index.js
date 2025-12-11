import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Transaction from './models/Transaction.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-plus';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.set("trust proxy", 1);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Rate Limiting - Prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50000000, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100000000, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply general rate limiter to all routes
app.use('/api/', generalLimiter);

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Auth Routes with rate limiting
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, {
            expiresIn: '7d'
        });
        res.status(201).json({ token, username: newUser.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '7d'
        });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/change-password', authenticateToken, authLimiter, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Find the user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Transaction Routes (Protected)
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;

        let query = { userId: req.user.id };

        // Filter by year and/or month
        if (year && month) {
            // Both year and month selected
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
            query.date = { $gte: startDate, $lte: endDate };
        } else if (year && !month) {
            // Only year selected (All Months for that year)
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;
            query.date = { $gte: startDate, $lte: endDate };
        }
        // If neither year nor month is selected, return all transactions (no date filter)

        const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const { amount, source, date, type, isRecurring, bankName, endDate } = req.body;

        // Validate input
        if (!amount || !source || !date || !type) {
            return res.status(400).json({ error: 'Amount, source, date, and type are required' });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }

        // If it's a recurring payment, create multiple transactions
        if (isRecurring && type === 'outflow' && endDate) {
            const transactions = [];
            const startDate = new Date(date);
            const finalDate = new Date(endDate);

            let currentDate = new Date(startDate);

            // Create transactions for each month until end date
            while (currentDate <= finalDate) {
                const transactionDate = currentDate.toISOString().split('T')[0];

                const newTransaction = new Transaction({
                    amount,
                    source,
                    date: transactionDate,
                    type,
                    isRecurring: true,
                    bankName,
                    endDate,
                    userId: req.user.id
                });

                const saved = await newTransaction.save();
                transactions.push(saved);

                // Move to next month, same day
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            res.status(201).json(transactions);
        } else {
            // Single transaction
            const newTransaction = new Transaction({
                amount,
                source,
                date,
                type,
                isRecurring: false,
                bankName: bankName || '',
                endDate: '',
                userId: req.user.id
            });
            const savedTransaction = await newTransaction.save();
            res.status(201).json([savedTransaction]);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
