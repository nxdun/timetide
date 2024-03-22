const express = require('express');
const router = express.Router();
const UserRoles = require('../models/userRolesSchema');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger.js');
const jwtMiddleware = require('../middleware/middlewareJwt');

//middleware for object validation
const validateRefObject = require('../middleware/validaterefinuserRoles.js')

// Middleware function to get user role by ID
const getUserRole = require('../middleware/getUserRole.js');

// Middleware function to hash password before saving to database
const hashPassword = require('../middleware/hashPassword.js');

// GET all user roles and return as JSON
router.get('/',jwtMiddleware , async (req, res) => {
    //role check
    //allow admin only
    if (req.user.role != 'admin') {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }

    try {
        
        logger.info('[userRolesRoutes] get all user roles request received');
        const userRoles = await UserRoles.find();
        res.json(userRoles);
    } catch (error) {
        logger.error('[userRolesRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});


//get user role objectid by username
//returns true if password is correct, else 500 + err message
router.get('/get/:id', jwtMiddleware, async (req, res) => {
    //role check
    //allows anyone who logged in
    //if role is student, only allow to get own user role
    if (req.user.role == 'student' && req.params.id != req.user.username) {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }
    //lecturer can access only student user role
    //can get own user role id
    if (req.user.role == 'lecturer' && req.params.id == req.user.username) {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }

   try{
    logger.info(`userRolesRoutes] gets user role id by username request received with id: ${req.params.id}`);
    const userRole = await UserRoles.findOne({ username: req.params.id });
    if (userRole == null) {
        return res.status(404).json({ message: 'Cannot find user role' });
    }
    res.json(userRole.refObject);
    }catch (error) {
        logger.error('[userRolesRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});


// GET a single user role by ID and return as JSON
router.get('/:id',jwtMiddleware, getUserRole, (req, res) => {
    //role check
    //admin can access all user roles
    if (req.user.role != 'admin') {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }
    try{
    logger.debug('[userRolesRoutes] get user role by id request received with id: ' + req.params.id);
    res.json(res.userRole);
    }catch (error) {
        logger.error('[userRolesRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// CREATE a new user role and return result as JSON
router.post('/',jwtMiddleware,validateRefObject, hashPassword, async (req, res) => {
    //role check
    //only admin can create user role
    if (req.user.role != 'admin') {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
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

// UPDATE a user role
router.patch('/:id',jwtMiddleware, getUserRole, validateRefObject, hashPassword, async (req, res) => {
    //role check
    //only admin can update user role
    if (req.user.role != 'admin') {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }

    try {
        logger.debug('[userRolesRoutes] update user role request received with id: ' + req.params.id);
        if (req.body.username != null) {
            res.userRole.username = req.body.username;
        }
        if (req.body.password != null) {
            res.userRole.password = req.body.password;
        }
        if (req.body.role != null) {
            res.userRole.role = req.body.role;
        }
        if (req.body.refObject != null) {
            res.userRole.refObject = req.body.refObject;
        }

        const updatedUserRole = await res.userRole.save();
        res.json(updatedUserRole);
    } catch (error) {
        logger.error('[userRolesRoutes] update user request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// DELETE a user role
router.delete('/:id',jwtMiddleware, getUserRole, async (req, res) => {
    //role check
    //only admin and lecturer can delete user role
    if (req.user.role != 'admin' && req.user.role != 'lecturer') {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }
    
    //lecturer can delete only student user role
    if (req.user.role == 'lecturer' && res.userRole.role != 'student') {
        logger.error(`[userRolesRoutes] Unauthrized operation requst ${req.user}` );
        return res.status(401).json({ message: " :[  You are not authorized to perform this operation" });
    }
    logger.info('[userRolesRoutes] delete user role request received with id: ' + req.params.id);
    try {
        await UserRoles.findByIdAndDelete(req.params.id);
        res.json({ message: 'User role deleted' });
    } catch (error) {
        logger.error('[userRolesRoutes] Delete request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

module.exports = router;
