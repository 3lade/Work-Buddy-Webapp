const express = require('express');
const router = express.Router();
const {
    getAllWfhRequests,
    getWfhRequestById,
    getWfhRequestsByUserId,
    addWfhRequest,
    updateWfhRequest,
    deleteWfhRequest
} = require('../controllers/wfhRequestController');
const { validateToken, authorizeRoles } = require('../authUtils');

router.post('/addWfhRequest', validateToken, authorizeRoles('Employee', 'Manager'), addWfhRequest);

router.get('/getAllWfhRequests', validateToken, authorizeRoles('Manager'), getAllWfhRequests);

router.get('/getWfhRequestById/:id', validateToken, authorizeRoles('Employee', 'Manager'), getWfhRequestById);

router.get('/user/:userId', validateToken, authorizeRoles('Employee', 'Manager'), getWfhRequestsByUserId);

router.put('/updateWfhRequest/:id', validateToken, authorizeRoles('Employee', 'Manager'), updateWfhRequest);

router.delete('/deleteWfhRequest/:id', validateToken, authorizeRoles('Employee', 'Manager'), deleteWfhRequest);

module.exports = router;