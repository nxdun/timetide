const express = require('express');
const router = express.Router();
const Student = require('../models/studentSchema');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single student
router.get('/:id', getStudent, (req, res) => {
    res.json(res.student);
});

// Create a student
router.post('/', async (req, res) => {
    console.log(req.body);
    try{
    const { name, regnb, enrolledCourses } = req.body;
    const student = new Student({
        name: name,
        regnb: regnb,
        enrolledCourses: enrolledCourses
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

} catch (error) {
    res.status(501).json({ message: `Error: ${req.body}` });
}
});

// Update a student
router.patch('/:id', getStudent, async (req, res) => {
    if (req.body.name != null) {
        res.student.name = req.body.name;
    }
    if (req.body.regnb != null) {
        res.student.regnb = req.body.regnb;
    }
    if (req.body.enrolledCourses != null) {
        res.student.enrolledCourses = req.body.enrolledCourses;
    }
    
    try {
        const updatedStudent = await res.student.save();
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a student
router.delete('/:id', getStudent, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function to get student by ID
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

module.exports = router;
