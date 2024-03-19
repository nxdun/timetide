const express = require('express');
const router = express.Router();
const Lecturer = require('../models/lecturerSchema');
const logger = require('../config/logger.js');

// GET all lecturers
router.get('/', async (req, res) => {
    logger.debug('[lecturerRoutes] get all lecturers request received');
    try {
        const lecturers = await Lecturer.find();
        res.json(lecturers);
    } catch (error) {
        logger.error('[lecturerRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// GET a single lecturer by ID
router.get('/:id', getLecturer, (req, res) => {
    logger.debug('[lecturerRoutes] get request received with id: ' + req.params.id);
    try{
    res.json(res.lecturer);
    }catch (error) {
        logger.error('[lecturerRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
    
});

// CREATE a new lecturer
router.post('/', async (req, res) => {
    logger.debug('[lecturerRoutes] post request received with body: ' + JSON.stringify(req.body));
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
        logger.error('[lecturerRoutes] post request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// UPDATE a lecturer
router.patch('/:id', getLecturer, async (req, res) => {
    logger.debug('[lecturerRoutes] update lecturer request received with id: ' + req.params.id);
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
        logger.error('[lecturerRoutes] update lecturer request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// DELETE a lecturer
router.delete('/:id', getLecturer, async (req, res) => {
    logger.debug('[lecturerRoutes] delete lecturer request received with id: ' + req.params.id);
    try {
        await Lecturer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lecturer deleted' });
    } catch (error) {
        logger.error('[lecturerRoutes] delete lecturer request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
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
        return res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
    res.lecturer = lecturer;
    next();
}

module.exports = router;
