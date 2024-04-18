const express = require('express');
const router = express.Router();
const logger = require('../config/logger.js');
const UserRoles = require('../models/userRolesSchema');
const Student = require('../models/studentSchema');
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
        logger.info(`Login successful for username: ${username} with role: ${userRole.role}`);
        
        // Generate JWT token
        const token = jwt.sign({ username: userRole.username, role: userRole.role, ref: userRole, id:userRole._id }, process.env.JWT_SECRET, { expiresIn: '5h'});
        //set cookie to token
        res.cookie('refobj', userRole.refObject);
        res.cookie('auth', token);
        // Send JWT token in response.
        //TODO:REMOVE THE TOKEN FROM RESPONSE
        res.status(200).json({ message: 'Login successful' });

    } else {
        logger.error(`invalid login: ${username}`);
        res.status(400).json({ message: 'Invalid credentials' }); 
    }
});


//can register students
//student username should match Student schemas regnb
//if lecturer give regid, student can register lecturer 
router.post('/register' , hashPassword, async (req, res) => {

    //for first time admin registration
    //body fields username, password, role
    if(req.body.role == 'admin'){
        //lets check if user is already logged in
        if (req.cookies.auth !== undefined) {
            return res.status(400).json({ message: 'try logging out first' });
        }
        //validate the body fields
        if (!req.body.username || !req.body.password || !req.body.role ) {
            return res.status(400).json({ message: 'All fields are required to proceed' });
        }
        //check if admin credentials are already set in env
        if(!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD){
            return res.status(400).json({ message: 'Unauthorized Operation' });
        }
        //compare username and password with admin credentials in env
        //compare password with hashed password
        const validPassword = await bcrypt.compare(process.env.ADMIN_PASSWORD, req.body.password);
        if (req.body.username !== process.env.ADMIN_USERNAME || !validPassword) {
            return res.status(400).json({ message: 'Unauthorized Operation' });
        }

        //add admin to userRoles
        try {
            const userRole = new UserRoles({
                username: req.body.username,
                password: req.body.password,
                role: 'admin',
                refObject:"777777777777777777777777" 
            });
            const newUserRole = await userRole.save();
            res.status(200).json("Successfully Registered, Try logging in now");
            logger.info(`userRolesRoutes] New user role created successfully with id: ${newUserRole._id}`);
        } catch (error) {
            logger.error('[userRolesRoutes] Create a new user role request failed with error: ' + error.message);
            res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
        }
    }else{

     //create global variable for refObject
    let objId ;
    //lets check if user is already logged in
    if (req.cookies.auth !== undefined) {
        return res.status(400).json({ message: 'try logging out first' });
    }
    //lets check body fields
    if (!req.body.username || !req.body.password || !req.body.role ) {
        return res.status(400).json({ message: 'All fields are required to proceed' });
    }
    //student username should match Student schemas regnb
    if(req.body.role == 'student'){
        const student = await Student.findOne({regnb: req.body.username});
        if(!student){
            return res.status(400).json({ message: 'Student id  is not currently registered try again later' });
        }
        objId = student._id;
    }else if(req.body.role == 'lecturer'){
    objId = req.body.refObject;
    }else{
        return res.status(400).json({ message: 'Invalid role' });
    }

        try {
    
            logger.debug('[userRolesRoutes] create new user role request received');
            const userRole = new UserRoles({
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                refObject: objId
            });
    
            const newUserRole = await userRole.save();
            res.status(200).json("Successfully Registered");
            logger.info(`userRolesRoutes] New user role created successfully with id: ${newUserRole._id}`);
        } catch (error) {
            logger.error('[userRolesRoutes] Create a new user role request failed with error: ' + error.message);
            res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
        }
    
    }
    }
        
    
);
    


router.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.clearCookie('refobj');
    res.status(200).json({ message: 'Logout successful' });
});

router.post('/logout', (req, res) => {
    res.clearCookie('auth');
    res.clearCookie('refobj');
    res.status(200).json({ message: 'Logout successful' });
}
);

//forget password
//body fields username, role, newpassword
router.post('/forgetpassword', async (req, res) => {
    //limit the request to 5 per minute
    
    //lets check role is lecturer or student
    if(req.body.role !== 'lecturer' && req.body.role !== 'student'){
        return res.status(400).json({ message: 'Invalid role' });
    }
    //lets check if user is already logged in
    if (req.cookies.auth !== undefined) {
        return res.status(400).json({ message: 'try logging out first' });
    }
    //lets check body fields
    if (!req.body.username || !req.body.role || !req.body.newpassword) {
        return res.status(400).json({ message: 'All fields are required to proceed' });
    }
    //lets check if user exists
    const userRole = await UserRoles.findOne({ username: req.body.username });
    if (!userRole) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (userRole.role !== req.body.role) {
        return res.status(400).json({ message: 'Invalid role' });
    }
    
    //hash the new password
    const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);
    //update the password
    try {
        await UserRoles.updateOne({ username: req.body.username }, { password: hashedPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    
});

router.post('/validate', jwtAuth, async (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});


module.exports = router;