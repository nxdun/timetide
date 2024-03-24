const express = require('express');
const router = express.Router();
const Resource = require('../models/resourceSchema');
const logger = require('../config/logger.js');

// Middleware function to get resource by ID
async function getResource(req, res, next) {
    let resource;
    try {
        resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.resource = resource;
    next();
}

// GET all resources
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single resource by ID
router.get('/:id', getResource, (req, res) => {
    res.json(res.resource);
});

// CREATE a new resource
router.post('/', async (req, res) => {
    //userrole management
    //only admin allowed to access
    if (req.user.role != 'admin') {
        logger.error(`Unauthorized access to create notification ${JSON.stringify(req.user.role)}`)
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const resource = new Resource({
        name: req.body.name,
        description: req.body.description,
        isAvailable: req.body.isAvailable
    });

    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a resource
router.patch('/:id', getResource, async (req, res) => {
    //userrole management
    //only admin allowed to access
    if (req.user.role != 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.body.name != null) {
        res.resource.name = req.body.name;
    }
    if (req.body.description != null) {
        res.resource.description = req.body.description;
    }
    if (req.body.isAvailable != null) {
        res.resource.isAvailable = req.body.isAvailable;
    }

    try {
        const updatedResource = await res.resource.save();
        res.json(updatedResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a resource
router.delete('/:id', getResource, async (req, res) => {
    //userrole management
    //only admin allowed to access
    if (req.user.role != 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
