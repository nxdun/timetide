const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
