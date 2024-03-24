const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationSchema');
const User = require('../models/userRolesSchema');

// Middleware function to get notification by ID
async function getNotification(req, res, next) {
    

    let notification;
    try {
        notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.notification = notification;
    next();
}

// GET all notifications
router.get('/', async (req, res) => {
    //userrole management
    //only students not allowed to access
    //sepreate routes avilable for students
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single notification by ID
router.get('/:id', getNotification, (req, res) => {
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(res.notification);
});

// CREATE a new notification
router.post('/', async (req, res) => {
    
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: `Unauthorized access to create notification ${req.user.role}` });
    }

    // Check if the user exists

    const user = await User.findById(req.body.userID);
    if (!user) {
        return res.status(404).json({ message: 'User not found/ Registerd' });
    }
    const notification = new Notification({
        userID: req.body.userID,
        message: req.body.message
    });

    try {
        const newNotification = await notification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(400).json({ message: `:[  Somthing wrong hapenned` });
    }
});

// UPDATE a notification
router.patch('/:id', getNotification, async (req, res) => {
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.body.userID != null) {
        res.notification.userID = req.body.userID;
    }
    if (req.body.message != null) {
        res.notification.message = req.body.message;
    }

    try {
        const updatedNotification = await res.notification.save();
        res.json(updatedNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a notification
router.delete('/:id', getNotification, async (req, res) => {
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
