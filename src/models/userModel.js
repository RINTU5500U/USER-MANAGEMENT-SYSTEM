const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true
    },
    gender: {
        type: String,
        // enum: ["Male", "Female", "Polygender", "Non-binary", "Agender"],
    },
    avatar: {
        type: String
    },
    domain: {
        type: String,
    },
    available: {
        type: Boolean,
    },
    createdAt: { 
        type: String,
        default: new Date().toLocaleString()
    },
    updatedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema) 