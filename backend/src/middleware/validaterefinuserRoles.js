const Student = require('../models/studentSchema');
const Lecturer = require('../models/lecturerSchema');
const logger = require('../config/logger.js');
require('dotenv').config();


async function validateRefObject(req, res, next) {
    logger.info('validateRefObject middleware called');
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
                return res.status(400).json({ message: 'Sorry user reference is invalid' });
            
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = validateRefObject;