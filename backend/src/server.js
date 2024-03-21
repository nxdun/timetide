const express = require('express');
const app = express();
const logger = require('./config/logger.js');
const connect = require('./config/dbconnection.js');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwtAuth = require('./middleware/middlewareJwt.js');
const cookieParser = require('cookie-parser');

app.use(helmet()); // Middleware for anti-XSS attacks
app.use(cookieParser());
app.use(bodyParser.json());
require('dotenv').config();
const port = process.env.PORT || 3000;

// Create a rate limiter instance
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: ";{  Too many requests Try again later. };"
});
// Apply the rate limiter to all requests
app.use(limiter);

const dbRouter = require('./routes/dbRouter');

// Apply JWT authentication middleware only to routes under /api
//app.use('/api', jwtAuth);

// Now mount the router for database CRUD operations
app.use('/api', dbRouter);

const authRouter = require('./routes/authRouter.js');
app.use('/auth', authRouter);  // All user authentication operations

const serviceRouter = require('./routes/serviceRouter.js');
app.use('/generate', serviceRouter);  // All service operations

app.listen(port, () => { 
    connect();
    logger.info(`Server is running on port  ${port}`);
});   // MongoDB connection listener
