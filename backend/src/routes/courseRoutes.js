const express = require("express");
const router = express.Router();
const Course = require("../models/courseSchema");
const logger = require("../config/logger.js");
const Lecturer = require("../models/lecturerSchema");
const Booking = require("../models/bookingSchema");
const mongoose = require("mongoose");

// Middleware function to get course by ID
async function getCourse(req, res, next) {
  let course;
  try {
    course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    logger.error(
      "[courseRoutes] get request failed with error: " + error.message
    );
    return res
      .status(500)
      .json({ message: " :[  Looks Like Something bad happening in Server" });
  }
  res.course = course;
  next();
}

// GET all courses
router.get("/", async (req, res) => {
  logger.debug("[courseRoutes] get all courses request received");
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    logger.error(
      "[courseRoutes] get request failed with error: " + error.message
    );
    res
      .status(500)
      .json({ message: " :[  Looks Like Something bad happening in Server" });
  }
});

// GET a single course by ID
router.get("/:id", getCourse, (req, res) => {
  logger.debug("[courseRoutes] get request received with id: " + req.params.id);
  try {
    res.json(res.course);
  } catch (error) {
    logger.error(
      "[courseRoutes] get request failed with error: " + error.message
    );
    res
      .status(500)
      .json({ message: " :[  Looks Like Something bad happening in Server" });
  }
});

router.post('/', async (req, res) => {
    try {
        logger.debug('[courseRoutes] post request received with body: ' + JSON.stringify(req.body));

        // Validate if all lecturer objects exist in the database
        const lecturerObjectsExist = await Promise.all(req.body.lecturerobjects.map(async lecturerId => {
            // Validate if this is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(lecturerId)) {
                return false; // Return false if it's not a valid ObjectId
            }
            const lecturer = await Lecturer.findById(lecturerId);
            return lecturer !== null; // Return true if lecturer exists, false otherwise
        }));

        if (lecturerObjectsExist.includes(false)) {
            return res.status(400).json({ message: 'One or more lecturer objects do not exist or contain invalid ObjectId.' });
        }

        // Validate if all booking objects exist in the database
        const bookingsExist = await Promise.all(req.body.schedule.map(async bookingId => {
            // Validate if this is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(bookingId)) {
                return false; // Return false if it's not a valid ObjectId
            }
            const booking = await Booking.findById(bookingId); // Using Booking model
            return booking !== null; // Return true if booking exists, false otherwise
        }));

        if (bookingsExist.includes(false)) {
            return res.status(400).json({ message: 'One or more booking objects do not exist or contain invalid ObjectId.' });
        }

        // Remove duplicates from the schedule array
        const uniqueScheduleIds = [...new Set(req.body.schedule)];

        // Check for overlapping schedules
        const overlappingSchedules = [];
        for (let i = 0; i < uniqueScheduleIds.length; i++) {
            const booking = await Booking.findById(uniqueScheduleIds[i]);
            if (!booking) continue; // Booking not found

            for (let j = i + 1; j < uniqueScheduleIds.length; j++) {
                const otherBooking = await Booking.findById(uniqueScheduleIds[j]);
                if (!otherBooking) continue; // Other booking not found

                // Check for overlap
                const startOverlap = otherBooking.StartTime < booking.EndTime && otherBooking.EndTime > booking.StartTime;
                const endOverlap = otherBooking.EndTime > booking.StartTime && otherBooking.StartTime < booking.EndTime;
                if (startOverlap || endOverlap) {
                    overlappingSchedules.push(uniqueScheduleIds[i], uniqueScheduleIds[j]);
                }
            }
        }

        if (overlappingSchedules.length > 0) {
            return res.status(400).json({ message: 'Overlap detected in schedules.', overlappedBookingIds: overlappingSchedules });
        }

        // Create the course object
        const course = new Course({
            Ccode: req.body.Ccode,
            description: req.body.description,
            credits: req.body.credits,
            lecturerobjects: req.body.lecturerobjects,
            schedule: uniqueScheduleIds
        });

        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (error) {
        logger.error('[courseRoutes] post request failed with error: ' + error.message);
        res.status(400).json({ message: error.message });
    }
});



// UPDATE a course
router.patch("/:id", getCourse, async (req, res) => {
  try {
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
      // Validate if all lecturer objects exist in the database
      const lecturerObjectsExist = await Promise.all(
        req.body.lecturerobjects.map(async (lecturerId) => {
          const lecturer = await Lecturer.findById(lecturerId);
          return lecturer !== null; // Return true if lecturer exists, false otherwise
        })
      );

      if (lecturerObjectsExist.includes(false)) {
        return res
          .status(400)
          .json({ message: "One or more lecturer objects do not exist." });
      }

      res.course.lecturerobjects = req.body.lecturerobjects;
    }
    if (req.body.schedule != null) {
      // Log the received schedule array
      logger.debug(
        "[courseRoutes] Received schedule array: " +
          JSON.stringify(req.body.schedule)
      );

      // Validate if all booking objects exist in the database
      const bookingsExist = await Promise.all(
        req.body.schedule.map(async (bookingId) => {
          try {
            // Log each bookingId being processed
            logger.debug("[courseRoutes] Processing bookingId: " + bookingId);

            // Retrieve the booking document by ID
            const booking = await Booking.findById(bookingId);
            logger.debug(
              "[courseRoutes] Retrieved booking: " + JSON.stringify(booking)
            );

            // Check if the booking exists
            return booking !== null; // Return true if booking exists, false otherwise
          } catch (error) {
            // Log any errors that occur during processing
            logger.error(
              "[courseRoutes] Error processing bookingId: " +
                bookingId +
                " - " +
                error.message
            );

            // Return false if an error occurs (invalid ObjectId or other error)
            return false;
          }
        })
      );

      // Log the results of bookingsExist array
      logger.debug(
        "[courseRoutes] bookingsExist array: " + JSON.stringify(bookingsExist)
      );

      if (bookingsExist.includes(false)) {
        return res
          .status(400)
          .json({
            message:
              "One or more booking objects do not exist or contain invalid ObjectId.",
          });
      }

      res.course.schedule = req.body.schedule;
    }

    const updatedCourse = await res.course.save();
    res.json(updatedCourse);
  } catch (error) {
    logger.error(
      "[courseRoutes] update course request failed with error: " + error.message
    );
    res.status(400).json({ message: error.message });
  }
});

// DELETE a course
router.delete("/:id", getCourse, async (req, res) => {
  logger.debug(
    "[courseRoutes] delete course request received with id: " + req.params.id
  );
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    logger.error(
      "[courseRoutes] delete course request failed with error: " + error.message
    );
    res
      .status(500)
      .json({ message: " :[  Looks Like Something bad happening in Server" });
  }
});

module.exports = router;
