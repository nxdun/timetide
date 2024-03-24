const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/middlewareJwt.js');

// Import route files
const userRolesRoutes = require('./userRolesRoutes');
const studentRoutes = require('./studentRoutes');
const lecturerRoutes = require('./lecturerRoutes');
const notificationRoutes = require('./notificationRoutes');
const courseRoutes = require('./courseRoutes');
const bookingsRoutes = require('./bookingsRoutes');
const hallRoutes = require('./hallRoutes');
const resourceRoutes = require('./resourceRoutes');


// Uses route files for each modulee
// Complete database management ops using api/<collectionName>
router.use('/userroles',jwtMiddleware, userRolesRoutes);
router.use('/students',jwtMiddleware, studentRoutes); //student creation no need to be authenticated but other operations need to be authenticated
router.use('/courses',jwtMiddleware, courseRoutes);
router.use('/halls',jwtMiddleware, hallRoutes);
router.use('/notifications', jwtMiddleware,notificationRoutes);
router.use('/resources',jwtMiddleware, resourceRoutes);
router.use('/bookings',jwtMiddleware, bookingsRoutes);
router.use('/lecturers',jwtMiddleware, lecturerRoutes);


module.exports = router;
