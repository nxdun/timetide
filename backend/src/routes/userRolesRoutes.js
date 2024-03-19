const express = require('express');
const router = express.Router();
const UserRoles = require('../models/userRolesSchema');

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

// GET all user roles
router.get('/', async (req, res) => {
    try {
        const userRoles = await UserRoles.find();
        res.json(userRoles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single user role by ID
router.get('/:id', getUserRole, (req, res) => {
    res.json(res.userRole);
});

// CREATE a new user role
router.post('/', async (req, res) => {
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
router.patch('/:id', getUserRole, async (req, res) => {
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
    try {
        await UserRoles.findByIdAndDelete(req.params.id);
        res.json({ message: 'User role deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
