const express = require("express");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const jwtMiddleware = require("./middleware/middlewareJwt.js");

const {connect} = require("./config/dbconnection.js");
const logger = require("./config/logger.js");
const serviceRouter = require("./routes/serviceRouter.js");
const authRouter = require("./routes/authRouter.js");
const dbRouter = require("./routes/dbRouter");
const notificationRouter = require("./routes/notifiRouter.js");

const app = express();
const port = process.env.PORT || 3000; //default is 3000
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: ";{  Too many requests Try again later. };",
  code: 503, //send service unavailable response
});

require("dotenv").config(); //enviroment variable initialization
app.use(helmet()); // Middleware for anti-XSS attacks
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // parse Body field
app.use(limiter); // Apply the rate limiter to all requests

// Version 1 routes
app.use("/v1/api", dbRouter); //all crud operations(full access to admin, limited access to lecturer, students cant access)
app.use("/v1/auth", authRouter); // All user authentication operations
app.use("/v1/generate",jwtMiddleware, serviceRouter); // All service operations
app.use("/v1/notifications", notificationRouter); // All service operations

// Version 2 routes
// use '/v2/api' here

//route all other requests
app.use("*", (req, res) => {
  res.status(405).json({ message: "Route not found" });
});

app.listen(port, () => {
  connect(); //connect with mongodb
  logger.info(`Server is running on port  ${port}`);
});


//for testing purposes
module.exports = app;