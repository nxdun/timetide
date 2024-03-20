const Student = require('../models/studentSchema');
const Lecturer = require('../models/lecturerSchema');

async function validateRefObject(req, res, next) {
    const { role, refObject } = req.body;

    try {
        // Check if refObject exists and matches the user's role
        if (role === 'student') {
            const student = await Student.findById(refObject);
            if (student) {
                req.refObject = student;
                return next();
            }
        } else if (role === 'lecturer') {
            const lecturer = await Lecturer.findById(refObject);
            if (lecturer) {
                req.refObject = lecturer;
                return next();
            }
        }

        // If role is not 'student' or 'lecturer', or if refObject doesn't match the role
        return res.status(400).json({ message: 'Invalid refObject ID or role.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = validateRefObject;