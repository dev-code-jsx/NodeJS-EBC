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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    toAccount: [{
        dpi: {
            type: Number,
            required: true
        },
        accountNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }
    }],
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'REVERTED'],
        default: 'PENDING'
    }
});