const express = require('express');
const router = express.Router();
const Lecturer = require('../models/lecturerSchema');

// GET all lecturers
router.get('/', async (req, res) => {
    try {
        const lecturers = await Lecturer.find();
        res.json(lecturers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single lecturer by ID
router.get('/:id', getLecturer, (req, res) => {
    res.json(res.lecturer);
});

// CREATE a new lecturer
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const lecturer = new Lecturer({
            name: req.body.name,
            honour: req.body.honour,
            contact_mail: req.body.contact_mail,
            contact_no: req.body.contact_no
        });

        const newLecturer = await lecturer.save();
        res.status(201).json(newLecturer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a lecturer
router.patch('/:id', getLecturer, async (req, res) => {
    if (req.body.name != null) {
        res.lecturer.name = req.body.name;
    }
    if (req.body.honour != null) {
        res.lecturer.honour = req.body.honour;
    }
    if (req.body.contact_mail != null) {
        res.lecturer.contact_mail = req.body.contact_mail;
    }
    if (req.body.contact_no != null) {
        res.lecturer.contact_no = req.body.contact_no;
    }

    try {
        const updatedLecturer = await res.lecturer.save();
        res.json(updatedLecturer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a lecturer
router.delete('/:id', getLecturer, async (req, res) => {
    try {
        await Lecturer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lecturer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function to get lecturer by ID
async function getLecturer(req, res, next) {
    let lecturer;
    try {
        lecturer = await Lecturer.findById(req.params.id);
        if (lecturer == null) {
            return res.status(404).json({ message: 'Lecturer not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.lecturer = lecturer;
    next();
}

module.exports = router;
