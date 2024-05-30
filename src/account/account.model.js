import mongoose from "mongoose";

const AccountSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    favorite: [{
        accountNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account"
        },
        dpi: {
            type: Number
        },
        alias: {
            type: String
        }
    }],
    transactions: [{
        idTransaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }  
    }],
    receivedTransactions: [{
        idTransaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }  
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: [ 'ACTIVE', 'INACTIVE' ],
        default: 'ACTIVE'
    }
});

export default mongoose.model("Account", AccountSchema);