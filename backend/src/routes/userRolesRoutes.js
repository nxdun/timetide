const express = require('express');
const router = express.Router();
const UserRoles = require('../models/userRolesSchema');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger.js');

// Middleware function to get user role by ID
async function getUserRole(req, res, next) {
    let userRole;
    try {
        userRole = await UserRoles.findById(req.params.id);
        if (!userRole) {
            return res.status(404).json({ message: 'User role not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.userRole = userRole;
    next();
}

// Hash password middleware
async function hashPassword(req, res, next) {
    try {
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET all user roles
router.get('/', async (req, res) => {
    try {
        logger.info('[userRolesRoutes] get all user roles request received');
        const userRoles = await UserRoles.find();
        res.json(userRoles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//check password is correct
router.get('/check/:id', async (req, res) => {
    try {
        logger.info('[userRolesRoutes] password check request received with id: ' + req.params.id + ' and password: ' + req.body.password + ')');
        const userRoles = await UserRoles.findById(req.params.id);
        const validPassword = await bcrypt.compare(req.body.password, userRoles.password);
        res.status(200).json(validPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET a single user role by ID
router.get('/:id', getUserRole, (req, res) => {
    logger.info('[userRolesRoutes] get user role by id request received with id: ' + req.params.id);
    res.json(res.userRole);
});

// CREATE a new user role
router.post('/', hashPassword, async (req, res) => {
    logger.info('[userRolesRoutes] create new user role request received');
    const userRole = new UserRoles({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        refObject: req.body.refObject
    });

    try {
        const newUserRole = await userRole.save();
        res.status(201).json(newUserRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a user role
router.patch('/:id', getUserRole, hashPassword, async (req, res) => {
    logger.info('[userRolesRoutes] update user role request received with id: ' + req.params.id);
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

    try {
        const updatedUserRole = await res.userRole.save();
        res.json(updatedUserRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a user role
router.delete('/:id', getUserRole, async (req, res) => {
    logger.info('[userRolesRoutes] delete user role request received with id: ' + req.params.id);
    try {
        await UserRoles.findByIdAndDelete(req.params.id);
        res.json({ message: 'User role deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
