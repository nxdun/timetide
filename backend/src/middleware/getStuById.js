/*
*   @desc: middleware function to get student by id
*   @param: request, response, next
*   @return: JSON object
*/

const Student = require('../models/studentSchema');
const logger = require('../config/logger');

async function getStudent(req, res, next) {
    try {
        //id validation
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }
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


