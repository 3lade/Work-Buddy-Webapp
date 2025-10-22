const jwt = require('jsonwebtoken');

const SECRET_KEY = 'asdfgewlnclnlhjkl';

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1h' });
};

const validateToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication failed - No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token Check: ', token);

        if(!token){
            console.log('No token found')
            return res.status(401).json({message: "Authentication failed - Token missing"})
        }

        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        console.log('Authentication check: ', req.user)
        next();
    } catch (error) {
        console.log('Token validation error:', error.message);
        
        // Check if it's a JWT specific error
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token - Please login again' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired - Please login again' });
        }
        
        return res.status(401).json({ message: 'Authentication failed - ' + error.message });
    }
};

const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        console.log('Authorize Check: ', req.user);
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message: "Forbidden Request. Insufficient permissions"})
        }
        next();
    }
}


module.exports = {
    generateToken,
    validateToken,
    authorizeRoles
};