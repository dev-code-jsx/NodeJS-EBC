import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['TRANSFER', 'PURCHASE', 'SERVICE'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    fromAccount: {
        type: Number,
        required: true
    },
    toAccount: {
        dpi: {
            type: Number,
            required: true
        },
        accountNumber: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'REVERTED'],
        default: 'PENDING'
    }
});

export default mongoose.model('Transaction', TransactionSchema);