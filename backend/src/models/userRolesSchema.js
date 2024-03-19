const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRolesSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'lecturer', 'admin'],
    required: true
  },
  refObject: {
    type: Schema.Types.ObjectId,
    refPath: 'role'
  }
});

const UserRoles = mongoose.model("UserRoles", userRolesSchema);

module.exports = UserRoles;
