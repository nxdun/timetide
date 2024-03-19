const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  StartTime: {
    type: Date,
    required: true
  },
  EndTime: {
    type: Date,
    required: true
  },
  BookedDay: {
    type: Date,
    required: true
  },
  Course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  Type: {
    type: String,
    enum: ['lab', 'lec', 'tute'],
    required: true
  },
  hall: {
    type: Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  }
});

const Bookings = mongoose.model("Bookings", bookingSchema);

module.exports = Bookings;
