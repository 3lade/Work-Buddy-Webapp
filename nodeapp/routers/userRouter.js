const express = require('express');
const router = express.Router();
const { 
    getUserByEmailAndPassword, 
    addUser, 
    getAllEmployees 
} = require('../controllers/userController');
const { validateToken, authorizeRoles } = require('../authUtils');


router.post('/signup', addUser)

router.post('/login', getUserByEmailAndPassword);

//POST: /api/user/getAllEmployees
router.get('/getAllEmployees', validateToken, authorizeRoles('Manager'),getAllEmployees);

module.exports = router;