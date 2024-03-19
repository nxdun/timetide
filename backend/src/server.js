// Import necessry modules here
const express = require('express');
const logger = require('./config/logger.js');
const  connect  = require('./config/dbconnection.js');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3000;

// MongoDB connection
app.listen(port, () => {
    //run const connect
    connect();
    logger.info(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    // Sample response
    res.send('Hello World!');
});



