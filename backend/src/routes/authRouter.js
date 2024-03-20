const express = require('express');
const router = express.Router();
const logger = require('../config/logger.js');
const UserRoles = require('../models/userRolesSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// router specific Middleware function to get user role by name

async function getUserRole(req, res, next) {
    try {
        const username = req.body.username;
        console.log("Searching for user role with username:", username);

        const userRole = await UserRoles.findOne({ username: username });
        if (!userRole) {
            logger.error('User role not found for username:', username);
            return res.status(404).json({ message: 'User role not found' });
        }
        res.userRole = userRole;
        next();
    } catch (error) {
        console.error("Error while fetching user role:", error);
        return res.status(500).json({ message: ':[ Internal server error'});
    }
}

router.post('/login', getUserRole, async (req, res) => {
    logger.debug('[login]: req.body:', req.body);
    // lets check if username and password are provided
    if (!req.body.username || !req.body.password ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    //lets set the username and password and userole to variables
    const { username, password } = req.body;
    const userRole = res.userRole;

    //lets check the password
    const validPassword = await bcrypt.compare(password, userRole.password);
    if (validPassword) {
        logger.info('Login successful for username:', req.username);
        
        // Generate JWT token
        const token = jwt.sign({ username: userRole.username, role: userRole.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send JWT token in response
        res.status(200).json({ message: 'Login successful', token: token });
    } else {
        logger.error('Invalid credentials for username:', req.username);
        res.status(400).json({ message: 'Invalid credentials' }); 
    }
});

//can register stdents 
router.get('/register', (req, res) => {
    //TODO:sends student object so view can be rendered only if user is admin
    res.send('here lies Register page');
}
);

//can register stdents 
router.post('/register', (req, res) => {
    //TODO:make this only admins can register new users
    //assign username,password,role,referObject to variables

   const { username, password, role, referObject } = req.body;
   //check all constains are not empty
   if (!username || !password || !role || !referObject) {
       return res.status(400).json({ message: 'All fields are required' });
   }
   
}
);

router.get('/logout', (req, res) => {
    res.send('Logout page');
}
);

router.get('/forgot-password', (req, res) => {
    //just send patch request to reset password in api/users
    res.send('Forgot password page');
}
);

module.exports = router;