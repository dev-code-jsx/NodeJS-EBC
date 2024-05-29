import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    codeUser: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    names: {
        type: String,
        required: true
    },
    lastNames: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    dpi: {
        type: number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    job: {
        type: String,
        required: true
    },
    monthlyIncome:{
        type: number,
        required: true
    },
    status: {
        type: String,
        enum: ['ASSET', 'IDLE', 'DISABLED'],
        default: 'ASSET'
    }
});

export default mongoose.model('User', UserSchema);