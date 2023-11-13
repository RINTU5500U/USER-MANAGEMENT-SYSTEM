const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Referencing the User model
        // unique: true
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencing the User model 
        // unique: true
        }],
    createdAt: { 
        type: String,
        default: new Date().toLocaleString()
    },
    updatedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Team', teamSchema) 