const express = require('express');
const router = express.Router();
const {
    getAllLeaveRequests,
    getLeaveRequestById,
    addLeaveRequest,
    updateLeaveRequest,
    getLeaveRequestsByUserId,
    deleteLeaveRequest
} = require('../controllers/leaveRequestController');
const { validateToken, authorizeRoles } = require('../authUtils');


router.post('/addLeaveRequest', validateToken, authorizeRoles('Employee', 'Manager'), addLeaveRequest);

router.get('/getAllLeaveRequests', validateToken, authorizeRoles('Manager'), getAllLeaveRequests);

router.get('/getLeaveRequestById:id', validateToken, authorizeRoles('Employee', 'Manager'), getLeaveRequestById);

router.put('/updateLeaveRequest/:id', validateToken, authorizeRoles('Employee', 'Manager'), updateLeaveRequest);

router.get('/getLeaveRequestByUserId/:userId', validateToken, authorizeRoles('Employee', 'Manager'), getLeaveRequestsByUserId);

router.delete('/deleteLeaveRequest/:id', validateToken, authorizeRoles('Employee', 'Manager'), deleteLeaveRequest);

module.exports = router;