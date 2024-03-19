const express = require('express');
const router = express.Router();
const Bookings = require('../models/bookingSchema.js');

// Middleware function to get booking by ID
async function getBooking(req, res, next) {
    let booking;
    try {
        booking = await Bookings.findById(req.params.id);
        if (booking == null) {
            return res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.booking = booking;
    next();
}

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Bookings.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single booking by ID
router.get('/:id', getBooking, (req, res) => {
    res.json(res.booking);
});

// CREATE a new booking
router.post('/', async (req, res) => {
    const booking = new Bookings({
        StartTime: req.body.StartTime,
        EndTime: req.body.EndTime,
        BookedDay: req.body.BookedDay,
        Course: req.body.Course,
        Type: req.body.Type,
        hall: req.body.hall
    });

    try {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a booking
router.patch('/:id', getBooking, async (req, res) => {
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

    try {
        const updatedBooking = await res.booking.save();
        res.json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a booking
router.delete('/:id', getBooking, async (req, res) => {
    try {
        await Bookings.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
