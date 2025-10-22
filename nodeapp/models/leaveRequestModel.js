const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
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
    leaveType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    file: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);