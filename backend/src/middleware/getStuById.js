const Student = require('../models/studentSchema');

async function getStudent(req, res, next) {
    let student;
    try {
        student = await Student.findById(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.student = student;
    next();
}

module.exports = getStudent;

// Middleware function to get student by ID
