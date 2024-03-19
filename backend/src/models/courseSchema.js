const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  Ccode: {
    type: String,
    required: true
  },
  description: String,
  credits: Number,
  lecturerobjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Lecturer'
  }],
  schedule: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }]
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
