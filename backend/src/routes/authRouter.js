const express = require('express');
const router = express.Router();
const logger = require('../config/logger.js');
const UserRoles = require('../models/userRolesSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//middleware for jwt token
const jwtAuth = require('../middleware/middlewareJwt.js');

//middleware for object validation
const validateRefObject = require('../middleware/validaterefinuserRoles.js')

// Middleware function to get user role by ID
const getUserRole = require('../middleware/getUserRole.js');

// Middleware function to hash password before saving to database
const hashPassword = require('../middleware/hashPassword.js');


router.post('/login', getUserRole, async (req, res) => {
    
    //lets check if user is already logged in
    if (req.cookies.auth || req.cookies.auth !== undefined) {
        return res.status(400).json({ message: 'User already logged in' });
    }
    // lets check if username and password are provided
    if (!req.body.username || !req.body.password ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    //lets set the username and password and userole to variables
    const { username, password } = req.body;
    //assign userRole received from getUserRole middleware 
    const userRole = res.userRole;

    //lets check the password
    const validPassword = await bcrypt.compare(password, userRole.password);
    if (validPassword) {
        logger.info('Login successful for username:', req.username);
        
        // Generate JWT token
        const token = jwt.sign({ username: userRole.username, role: userRole.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //set cookie to token
        res.cookie('refobj', userRole.refObject);
        res.cookie('auth', token);
        // Send JWT token in response
        //TODO:REMOVE THE TOKEN FROM RESPONSE
        res.status(200).json({ message: 'Login successful', token: token });
    } else {
        logger.error('Invalid credentials for username:', req.username);
        res.status(400).json({ message: 'Invalid credentials' }); 
    }
});


//can register students 
router.post('/register',jwtAuth ,  validateRefObject, hashPassword, async (req, res) => {
    //lets check if user is a admin or lecturer
    if (req.userRole.role !== 'admin' || req.userRole.role !== 'lecturer') {
        return res.status(400).json({ message: 'You are not authorized to perform this operation' });
    }
    //lets check if user is already logged in
    if (req.cookies.auth !== undefined) {
        return res.status(400).json({ message: 'try logging out first' });
    }

    //lets check if username and password are provided
    if (!req.body.username || !req.body.password || !req.body.role || !req.body.refObject) {
        return res.status(400).json({ message: 'All fields are required to proceed' });
    }

    try {

        logger.debug('[userRolesRoutes] create new user role request received');
        const userRole = new UserRoles({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            refObject: req.body.refObject
        });

        const newUserRole = await userRole.save();
        res.status(200).json(newUserRole);
    } catch (error) {
        logger.error('[userRolesRoutes] Create a new user role request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.clearCookie('obj');
    res.status(200).json({ message: 'Logout successful' });
}
);

router.post('/logout', (req, res) => {
    res.clearCookie('auth');
    res.clearCookie('obj');
    res.status(200).json({ message: 'Logout successful' });
}
);


module.exports = router;