const express = require('express');
const router = express.Router();
const Hall = require('../models/hallSchema');
const logger = require('../config/logger');
const mongoose = require('mongoose');
const Resource = require('../models/resourceSchema');
// Middleware function to get hall by ID
async function getHall(req, res, next) {
    let hall;
    try {
        hall = await Hall.findById(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
    } catch (error) {
        logger.error('[hallRoutes] get request failed with error: ' + error.message);
        return res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });

    }
    res.hall = hall;
    next();
}

// GET all halls
router.get('/', async (req, res) => {
    logger.debug('[hallRoutes] get all halls request received');
    try {
        const halls = await Hall.find();
        res.json(halls);
    } catch (error) {
        logger.error('[hallRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// GET a single hall by ID
router.get('/:id', getHall, (req, res) => {
    logger.debug('[hallRoutes] get request received with id: ' + req.params.id);
    try{
    res.json(res.hall);
    }catch (error) {
        logger.error('[hallRoutes] get request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

// CREATE a new hall
router.post('/', async (req, res) => {
    //userrole management
    //only admin allowed to access
    if (req.user.role != 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        logger.debug('[hallRoutes] post request received with body: ' + JSON.stringify(req.body));

        // Validate if all resource objects exist in the database
        const resourcesExist = await Promise.all(req.body.resources.map(async resourceId => {
            // Validate if this is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(resourceId)) {
                return false; // Return false if it's not a valid ObjectId
            }

            // Find the resource by ID
            const resource = await Resource.findById(resourceId);
            return resource !== null; // Return true if resource exists, false otherwise
        }));

        if (resourcesExist.includes(false)) {
            return res.status(400).json({ message: 'One or more resource objects do not exist or contain invalid ObjectId.' });
        }

        // Create a new hall object
        const hall = new Hall({
            hallid: req.body.hallid,
            buildingName: req.body.buildingName,
            floor: req.body.floor,
            resources: req.body.resources
        });

        // Save the new hall object to the database
        const newHall = await hall.save();
        res.status(201).json(newHall);
    } catch (error) {
        logger.error('[hallRoutes] post request failed with error: ' + error.message);
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a hall
router.patch('/:id', getHall, async (req, res) => {
    //userrole management
    //only admin allowed to access
    if (req.user.role != 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        logger.debug('[hallRoutes] update hall request received with id: ' + req.params.id);

        // Update hall properties if provided in the request body
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
            // Validate if all resource objects exist in the database
            const resourcesExist = await Promise.all(req.body.resources.map(async resourceId => {
                // Validate if this is a valid ObjectId
                if (!mongoose.Types.ObjectId.isValid(resourceId)) {
                    return false; // Return false if it's not a valid ObjectId
                }

                // Find the resource by ID
                const resource = await Resource.findById(resourceId);
                return resource !== null; // Return true if resource exists, false otherwise
            }));

            if (resourcesExist.includes(false)) {
                return res.status(400).json({ message: 'One or more resource objects do not exist or contain invalid ObjectId.' });
            }

            // Assign the resources to the hall
            res.hall.resources = req.body.resources;
        }

        // Save the updated hall object to the database
        const updatedHall = await res.hall.save();
        res.json(updatedHall);
    } catch (error) {
        logger.error('[hallRoutes] update hall request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});


// DELETE a hall
router.delete('/:id', getHall, async (req, res) => {
    //userrole management
    //only admin allowed to access
    if (req.user.role != 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    logger.debug('[hallRoutes] delete hall request received with id: ' + req.params.id);
    try {
        await Hall.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hall deleted' });
    } catch (error) {
        logger.error('[hallRoutes] delete hall request failed with error: ' + error.message);
        res.status(500).json({ message: " :[  Looks Like Something bad happening in Server" });
    }
});

module.exports = router;
