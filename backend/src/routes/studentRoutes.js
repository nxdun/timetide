const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const Student = require('../models/studentSchema');
const Course = require('../models/courseSchema');
const mongoose = require('mongoose');
const getStudent = require('../middleware/getStuById');
const jwtMiddleware = require('../middleware/middlewareJwt');

// Get all students
router.get('/',jwtMiddleware,  async (req, res) => {
    //roles: admin, lecturer
    if (req.user.role === 'student') {
        logger.error(`Unauthorized access to students by {${req.user}}`);
        return res.status(403).json({ message: 'Unauthorized' });
    }
    logger.info('Get all students');
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single student
router.get('/:id',jwtMiddleware, getStudent, (req, res) => {
    //roles: admin, lecturer   
    if (req.user.role === 'student') {
        logger.error(`Unauthorized access to student by {${req.user}}`);
        return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(res.student);
});


// Create a student
router.post('/', async (req, res) => {
    //roles: admin, lecturer
    if (req.user.role === 'student') {
        logger.error(`Unauthorized access to create student by {${req.user}}`);
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        const { name, regnb, enrolledCourses } = req.body;
        
        // lets check object ids one by one in req body
        const areAllValidIds = enrolledCourses.every(courseId => mongoose.Types.ObjectId.isValid(courseId));
        if (!areAllValidIds) {
            return res.status(400).json({ message: 'One or more enrolled courses have invalid IDs.' });
        }

        // lets validate these objects exist in database
        const coursesExist = await Promise.all(enrolledCourses.map(async courseId => {
            const course = await Course.findById(courseId);
            return course !== null; // Return true if course exists, false otherwise
        }));
        
        if (coursesExist.includes(false)) {
            return res.status(400).json({ message: 'course id is not exist in database' });
        }

        // Check for duplicate course IDs
        // duplicates will be removed
        const uniqueEnrolledCourses = Array.from(new Set(enrolledCourses));

        // Create the student object
        const student = new Student({
            name: name,
            regnb: regnb,
            enrolledCourses: uniqueEnrolledCourses
        });

        // Save the student object to the database
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Update a student
router.patch('/:id',jwtMiddleware, getStudent, async (req, res) => {
    //roles: admin, lecturer
    if (req.user.role === 'student') {
        logger.error(`Unauthorized access to update student by {${req.user}}`);
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        if (req.body.name != null) {
            res.student.name = req.body.name;
        }
        if (req.body.regnb != null) {
            res.student.regnb = req.body.regnb;
        }
        if (req.body.enrolledCourses != null) {
            // Validate if all enrolled courses are valid ObjectId strings
            const areAllValidIds = req.body.enrolledCourses.every(courseId => mongoose.Types.ObjectId.isValid(courseId));
            if (!areAllValidIds) {
                return res.status(400).json({ message: 'One or more enrolled courses have invalid IDs.' });
            }

            // Validate if all enrolled courses exist in the database
            const coursesExist = await Promise.all(req.body.enrolledCourses.map(async courseId => {
                const course = await Course.findById(courseId);
                return course !== null; // Return true if course exists, false otherwise
            }));
            
            if (coursesExist.includes(false)) {
                return res.status(400).json({ message: 'One or more enrolled courses do not exist.' });
            }

            // Check for duplicate course IDs
            const uniqueEnrolledCourses = Array.from(new Set(req.body.enrolledCourses));
            
            res.student.enrolledCourses = uniqueEnrolledCourses;
        }
        
        const updatedStudent = await res.student.save();
        res.json(updatedStudent);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


// Delete a student
router.delete('/:id',jwtMiddleware, getStudent, async (req, res) => {
    //roles: admin, lecturer
    if (req.user.role === 'student') {
        logger.error(`Unauthorized access to delete student by {${req.user}}`);
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






module.exports = router;
