const mongoose = require('mongoose');

const wfhRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WfhRequest', wfhRequestSchema);