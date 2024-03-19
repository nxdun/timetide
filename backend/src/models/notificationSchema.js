const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'UserRoles',
    required: true
  },
  message: String
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
