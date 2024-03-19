const express = require('express');
const router = express.Router();
const Course = require('../models/courseSchema');

// Middleware function to get course by ID
async function getCourse(req, res, next) {
    let course;
    try {
        course = await Course.findById(req.params.id);
        if (course == null) {
            return res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.course = course;
    next();
}

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single course by ID
router.get('/:id', getCourse, (req, res) => {
    res.json(res.course);
});

// CREATE a new course
router.post('/', async (req, res) => {
    const course = new Course({
        Ccode: req.body.Ccode,
        description: req.body.description,
        credits: req.body.credits,
        lecturerobjects: req.body.lecturerobjects,
        schedule: req.body.schedule
    });

    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE a course
router.patch('/:id', getCourse, async (req, res) => {
    if (req.body.Ccode != null) {
        res.course.Ccode = req.body.Ccode;
    }
    if (req.body.description != null) {
        res.course.description = req.body.description;
    }
    if (req.body.credits != null) {
        res.course.credits = req.body.credits;
    }
    if (req.body.lecturerobjects != null) {
        res.course.lecturerobjects = req.body.lecturerobjects;
    }
    if (req.body.schedule != null) {
        res.course.schedule = req.body.schedule;
    }

    try {
        const updatedCourse = await res.course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a course
router.delete('/:id', getCourse, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
