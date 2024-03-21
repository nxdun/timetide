const express = require('express');
const router = express.Router();
const UserRoles = require('../models/userRolesSchema');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger.js');

//middleware for object validation
const validateRefObject = require('../middleware/validaterefinuserRoles.js')

// Middleware function to get user role by ID
const getUserRole = require('../middleware/getUserRole.js');

// Middleware function to hash password before saving to database
const hashPassword = require('../middleware/hashPassword.js');

// GET all user roles and return as JSON
router.get('/', async (req, res) => {
    try {
        
        logger.info('[userRolesRoutes] get all user roles request received');
        const userRoles = await UserRoles.find();
        res.json(userRoles);
    } catch (error) {
        logger.error('[userRolesRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});
//check if password is correct
//returns true if password is correct, else 500 + err message
router.get('/check/:id', async (req, res) => {
    try {
        logger.debug('[userRolesRoutes] password check request received with id: ' + req.params.id + ' and password: ' + req.body.password + ')');
        const userRoles = await UserRoles.findById(req.params.id);
        const validPassword = await bcrypt.compare(req.body.password, userRoles.password);
        res.status(200).json(validPassword);
    } catch (error) {
        logger.error('[userRolesRoutes] password check request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});


// GET a single user role by ID and return as JSON
router.get('/:id', getUserRole, (req, res) => {
    try{
    logger.debug('[userRolesRoutes] get user role by id request received with id: ' + req.params.id);
    res.json(res.userRole);
    }catch (error) {
        logger.error('[userRolesRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// CREATE a new user role and return result as JSON
router.post('/', validateRefObject, hashPassword, async (req, res) => {
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
router.patch('/:id', getUserRole, validateRefObject, hashPassword, async (req, res) => {
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
router.delete('/:id', getUserRole, async (req, res) => {
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
