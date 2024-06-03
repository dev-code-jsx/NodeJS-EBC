import mongoose from "mongoose";

const ServiceSchema = mongoose.Schema({
    nameService: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Service', ServiceSchema);