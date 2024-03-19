const mongoose = require('mongoose');

const lecturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  honour: String,
  contact_mail: String,
  contact_no: String
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

module.exports = Lecturer;
