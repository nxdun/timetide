const express = require("express");
const router = express.Router();
const logger = require("../config/logger.js");
const Notification = require("../models/notificationSchema.js");
const jwtAuth = require("../middleware/middlewareJwt.js");


router.get("/request/:id",jwtAuth, async (req, res) => {
    const id = req.params.id;

    //validate is logged in user is same as requested user
    //jwt authenticated user data is stored in req.user
    const user = req.user;
    if (user.id !== id) {
        logger.error(`[Notifi]Unauthorized access to notifications by user id ${id}`);
        return res.status(401).json({ message: "Unauthorized access to notifications" });
    }
  
    logger.info(`[Notifi]Request reciver for notifications by user id  ${id}`);

    try {
        const notification = await Notification.find({ userID: id });
        res.status(200).json(notification);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
  

module.exports = router;
