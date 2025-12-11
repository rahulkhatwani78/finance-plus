import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    source: {
        type: String,
        required: true, // "Source" for inflow, "Recipient" for outflow
    },
    date: {
        type: String, // Storing as YYYY-MM-DD string
        required: true,
    },
    type: {
        type: String, // 'inflow' or 'outflow'
        required: true,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    bankName: {
        type: String,
        default: '',
    },
    endDate: {
        type: String, // End date for recurring payments (YYYY-MM-DD)
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
