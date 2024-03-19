
const express = require('express');
const logger = require('./config/logger.js');
const  connect  = require('./config/dbconnection.js');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Import route files for each module
const userRolesRoutes = require('./routes/userRolesRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const hallRoutes = require('./routes/hallRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');

// Use route files for each module
//app.use(express.json({ limit: "2mb" }));
//app.use('/api/userRoles', userRolesRoutes);
//app.use('/api/students', studentRoutes);
//app.use('/api/courses', courseRoutes);
//app.use('/api/halls', hallRoutes);
//app.use('/api/resources', resourceRoutes);
//app.use('/api/bookings', bookingsRoutes);
//app.use('/api/notifications', notificationRoutes);
app.use('/lec', lecturerRoutes);

// MongoDB connection
app.listen(port, () => {
    //run const connect
    connect();
    logger.info(`Server is running on port ${port}`);
});




