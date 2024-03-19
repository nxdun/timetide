const express = require('express');
const router = express.Router();
const Hall = require('../models/hallSchema');

// Middleware function to get hall by ID
async function getHall(req, res, next) {
    let hall;
    try {
        hall = await Hall.findById(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.hall = hall;
    next();
}

// GET all halls
router.get('/', async (req, res) => {
    try {
        const halls = await Hall.find();
        res.json(halls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single hall by ID
router.get('/:id', getHall, (req, res) => {
    res.json(res.hall);
});

// CREATE a new hall
router.post('/', async (req, res) => {
    const hall = new Hall({
        hallid: req.body.hallid,
        buildingName: req.body.buildingName,
        floor: req.body.floor,
        resources: req.body.resources
    });

    try {
        const newHall = await hall.save();
        res.status(201).json(newHall);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a hall
router.patch('/:id', getHall, async (req, res) => {
    if (req.body.hallid != null) {
        res.hall.hallid = req.body.hallid;
    }
    if (req.body.buildingName != null) {
        res.hall.buildingName = req.body.buildingName;
    }
    if (req.body.floor != null) {
        res.hall.floor = req.body.floor;
    }
    if (req.body.resources != null) {
        res.hall.resources = req.body.resources;
    }

    try {
        const updatedHall = await res.hall.save();
        res.json(updatedHall);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a hall
router.delete('/:id', getHall, async (req, res) => {
    try {
        await Hall.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hall deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
