const express = require("express");
const router = express.Router();
const logger = require("../config/logger.js");
const Notification = require("../models/notificationSchema.js");
const jwtAuth = require("../middleware/middlewareJwt.js");


router.get("/request/:id",jwtAuth, async (req, res) => {
    const id = req.params.id;
    logger.info(`Request for notifications by user id  ${id}`);

    try {
        const notification = await Notification.find({ userID: id });
        res.status(200).json(notification);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
  

module.exports = router;
