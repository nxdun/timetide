const Student = require('../models/studentSchema');

async function getStudent(req, res, next) {
    try {
        const student = await Student.findById(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Send the student data as JSON response
        res.status(200).json(student);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = getStudent;


