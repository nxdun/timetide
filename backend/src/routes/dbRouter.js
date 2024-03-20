const express = require('express');
const router = express.Router();


// Import route files
const userRolesRoutes = require('./userRolesRoutes');
const studentRoutes = require('./studentRoutes');
const courseRoutes = require('./courseRoutes');
const hallRoutes = require('./hallRoutes');
const resourceRoutes = require('./resourceRoutes');
const bookingsRoutes = require('./bookingsRoutes');
const notificationRoutes = require('./notificationRoutes');
const lecturerRoutes = require('./lecturerRoutes');

// Uses route files for each module
// Complete database management ops using api/<collectionName>
router.use('/userRoles', userRolesRoutes);
router.use('/student', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/halls', hallRoutes);
router.use('/resources', resourceRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/lecturer', lecturerRoutes);

module.exports = router;
