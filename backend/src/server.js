// Import necessary modules here
const express = require('express');
const logger = require('./config/logger.js');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    // Sample response
    res.send('Hello World!');
});


// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
