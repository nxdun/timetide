const express = require('express');
const connect = require('./config/dbconnection.js');
const cookieParser = require('cookie-parser');
const jwtAuth = require('./middleware/middlewareJwt.js');
const app = express();
const logger = require('./config/logger.js');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const serviceRouter = require('./routes/serviceRouter.js');
const authRouter = require('./routes/authRouter.js');
const dbRouter = require('./routes/dbRouter');
const notificationRouter = require('./routes/notifiRouter.js');
const port = process.env.PORT || 3000; //default is 3000
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: ";{  Too many requests Try again later. };"
});

require('dotenv').config();  //enviroment variable initialization
app.use(helmet());           // Middleware for anti-XSS attacks
app.use(cookieParser());     // Parse cookies 
app.use(bodyParser.json());  // parse Body field
app.use(limiter)             // Apply the rate limiter to all requests
//app.use('/api', jwtAuth);
app.use('/api', dbRouter);     //all crud operations
app.use('/auth', authRouter);  // All user authentication operations
app.use('/generate', serviceRouter);  // All service operations
app.use('/notifications', notificationRouter);  // All service operations


app.listen(port, () => {
    connect();  //connect with mongodb
    logger.info(`Server is running on port  ${port}`);
});   