const express = require('express');
const router = express.Router();
const Bookings = require('../models/bookingSchema.js');
const logger = require('../config/logger.js');
const Hall = require('../models/hallSchema.js');
const Course = require('../models/courseSchema.js');

// Middleware function to get booking by ID
async function getBooking(req, res, next) {
    try {
    let booking;
        booking = await Bookings.findById(req.params.id);
        if (booking == null) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.booking = booking;
    } catch (error) {
        logger.error('[bookingsRoutes] get request failed with error: ' + error.message);
        return res.status(500).json({ message: " :[  1Looks Like Something bad happening in Server" });
    }
    next();
}

// GET all bookings
router.get('/', async (req, res) => {
    logger.debug('[bookingsRoutes] get all bookings request received');
    try {
        const bookings = await Bookings.find();
        res.json(bookings);
    } catch (error) {
        logger.error('[bookingsRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  2Looks Like Something bad happening in Server" });
    }
});

// GET a single booking by ID
router.get('/:id', getBooking, (req, res) => {
    try {
    res.status(200).json(res.booking);
    }catch (error) {
        logger.error('[bookingsRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  3Looks Like Something bad happening in Server" });
    }
});

// CREATE a new booking
router.post('/', async (req, res) => {
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    logger.debug('[bookingsRoutes] post request received with body: ' + JSON.stringify(req.body));

    try {
        // Validate if the provided hall exists
        const hallExists = await Hall.findById(req.body.hall);
        if (!hallExists) {
            return res.status(400).json({ message: "Hall not found" });
        }
        const courseExists = await Course.findById(req.body.Course);
        if (!courseExists) {
            return res.status(400).json({ message: "Invalid Course id" });
        }

        const booking = new Bookings({
            StartTime: req.body.StartTime,
            EndTime: req.body.EndTime,
            BookedDay: req.body.BookedDay,
            Course: req.body.Course,
            Type: req.body.Type,
            hall: req.body.hall
        });
        const newBooking = await booking.save();
        res.status(201).json(newBooking);

    } catch (error) {
        logger.error('[bookingsRoutes] post request failed with error: ' + error.message);
        res.status(400).json({ message: " :[  4Looks Like Something bad happening in Server" });
    }
});

// UPDATE a booking
router.patch('/:id', getBooking, async (req, res) => {
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    logger.debug('[bookingsRoutes] patch request received with id: ' + req.params.id + ' and body: ' + JSON.stringify(req.body));
    try {
        if (req.body.hall) {
            // Validate if the provided hall exists
            const hallExists = await Hall.findById(req.body.hall);
            if (!hallExists) {
                return res.status(400).json({ message: "Hall not found" });
            }
            const courseExists = await Course.findById(req.body.Course);
            if (!courseExists) {
            return res.status(400).json({ message: "Invalid Course id" });
            }
        }

        if (req.body.StartTime != null) {
            res.booking.StartTime = req.body.StartTime;
        }
        if (req.body.EndTime != null) {
            res.booking.EndTime = req.body.EndTime;
        }
        if (req.body.BookedDay != null) {
            res.booking.BookedDay = req.body.BookedDay;
        }
        if (req.body.Course != null) {
            res.booking.Course = req.body.Course;
        }
        if (req.body.Type != null) {
            res.booking.Type = req.body.Type;
        }
        if (req.body.hall != null) {
            res.booking.hall = req.body.hall;
        }

        const updatedBooking = await res.booking.save();
        res.json(updatedBooking);
    } catch (error) {
        logger.error('[bookingsRoutes] patch request failed with error: ' + error.message);
        res.status(400).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// DELETE a booking
router.delete('/:id', getBooking, async (req, res) => {
    //userrole management
    //only students not allowed to access
    if (req.user.role == 'student') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    logger.debug('[bookingsRoutes] delete request received with id: ' + req.params.id);
    try {
        await Bookings.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        logger.error('[bookingsRoutes] delete request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

module.exports = router;
