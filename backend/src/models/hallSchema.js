const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hallSchema = new Schema({
  hallid: {
    type: String,
    required: true
  },
  buildingName: {
    type: String,
    required: true
  },
  floor: Number,
  resources: [{
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  }]
});

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;
 