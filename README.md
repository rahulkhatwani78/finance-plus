# Finance+ 💰

A modern, secure, and responsive finance management application for tracking household income and expenses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

## ✨ Features

### 💰 Financial Management
- Track income and expenses
- Categorize transactions by source/recipient
- View total balance, inflow, and outflow
- Recurring payment support with end dates
- Month and year filtering

### 🎨 User Experience
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔄 Sort transactions (latest/oldest first)
- 📊 Visual dashboard with statistics
- 💫 Smooth animations and transitions

### 🔐 Security
- JWT-based authentication
- Bcrypt password hashing
- Rate limiting (brute force protection)
- Multi-user support with data isolation
- Secure password change functionality

### 🛡️ Rate Limiting
- **Auth Routes**: 5 attempts per 15 minutes
- **General API**: 100 requests per 15 minutes
- IP-based tracking

## 🏗️ Project Structure

```
finance-plus/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # API configuration
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/            # Backend (Node + Express)
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md            # This file
```

## 🚀 Quick Start

### ⚡ Automated Setup (Recommended)

```powershell

# 1. Edit environment files
# Edit client/.env - Set VITE_API_URL=http://localhost:5000
# Edit server/.env - Set your MONGO_URI and JWT_SECRET

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Start development servers
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

## 🚀 Manual Installation (Alternative)

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd finance-plus
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Run Development Servers**
   
   Terminal 1 (Server):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Client):
   ```bash
   cd client
   npm run dev
   ```

5. **Open Browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS Variables** - Theming

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Rate Limit** - Rate limiting

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Links
- **Frontend**: Deploy to [Vercel](https://vercel.com) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- **Backend**: Deploy to [Render](https://render.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🔒 Security Features

1. **Authentication**
   - JWT tokens with 7-day expiration
   - Secure password hashing with bcrypt
   - Token-based API protection

2. **Rate Limiting**
   - Login attempts: 5 per 15 minutes
   - API requests: 100 per 15 minutes
   - IP-based tracking

3. **Data Protection**
   - User data isolation
   - Input validation
   - CORS configuration

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - Mobile: ≤480px
  - Tablet: ≤768px
  - Desktop: >768px
- **Touch Friendly**: 44x44px minimum touch targets
- **Fluid Typography**: Scales with viewport

## 🎨 Theme Support

- Dark mode (default)
- Light mode
- Persistent theme preference
- Smooth transitions

## 🧪 Testing

```bash
# Test server health
curl http://localhost:5000/health

# Test rate limiting
# Try logging in 6 times with wrong password
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern finance apps

---

**Made with ❤️ for better financial management**
