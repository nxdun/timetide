const express = require("express");
const router = express.Router();
const logger = require("../config/logger.js");
const Student = require("../models/studentSchema.js");
const Course = require("../models/courseSchema.js");
const Booking = require("../models/bookingSchema.js");
const Lecturer = require("../models/lecturerSchema.js");
const Hall = require("../models/hallSchema.js");
const mongoose = require("mongoose");

//send student id as a parameter
router.get("/weekly/:studentId", async (req, res) => {

  //parameeter validation
  if (!req.params.studentId) {
    return res.status(400).json({ message: "Student id is required" });
  }
  if (req.params.studentId.length !== 24 || !mongoose.Types.ObjectId.isValid(req.params.studentId)) {
    return res.status(400).json({ message: "Invalid student id" });
  }
  try {
    const studentId = req.params.studentId;
    logger.info(
      " .recived request to generate timetable for student with id: " +
        studentId
    );

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: " .Student not found" });
    }
    logger.info(" .student found in db");
    // Get enrolled courses for the student
    const enrolledCourses = student.enrolledCourses;

    // Constructing timetable
    let timetable = {};
    //loop through each course inside student's enrolled courses
    for (const courseId of enrolledCourses) {
      logger.info("  ..for loop  schedules  : courseId " + courseId);
      const course = await Course.findById(courseId);
      logger.info("  ..course found in db with id: " + course.Ccode);
      //no need to check if course exists as student can only enroll in existing courses

      //gets lecturer names
      let lecturerNames = [];
      for (const lecturerId of course.lecturerobjects) {
        const lecturer = await Lecturer.findById(lecturerId);
        lecturerNames.push(lecturer.name);
      }
      logger.info("  ..lecturer names found for course: " + lecturerNames);

      const scheduleId = course.schedule;
      logger.info("  ..for loop started " + scheduleId);
      //loop through each schedule inside course's schedule
      for (const id of scheduleId) {
        
        logger.info("   ...for loop schedules   : scheduleId " + scheduleId);
        const schedule = await Booking.findById(id);
        logger.info(
          "   ...schedule found for course with type: " + schedule.Type
        );
        const hall = await Hall.findById(schedule.hall);
        logger.info("   ...hall found for schedule with name: " + hall.hallid);

        const dayOfWeek = new Date(schedule.BookedDay).toLocaleString("en-us", {
          weekday: "short",
        });

        // in here Check if the array for the day of the week exists, if not, initialize it
        if (!timetable[dayOfWeek]) {
          timetable[dayOfWeek] = [];
        }

        // letzz Push the schedule information into the timetable array for the day of the week
        timetable[dayOfWeek].push({
          type: schedule.Type,
          lecturerNames: lecturerNames,
          startDate: new Date(schedule.StartTime).toLocaleString("en-us", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          endDate: new Date(schedule.EndTime).toLocaleString("en-us", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          moduleName: course.description,
          code: course.Ccode,
          hallid: hall.hallid,
          hallbuildingName: hall.buildingName,
        });
      }
    }

    res.json(timetable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
