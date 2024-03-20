const express = require('express');
const router = express.Router();
const logger = require('../config/logger.js');
const Student = require('../models/studentSchema.js');
const Course = require('../models/courseSchema.js');
const Booking = require('../models/bookingSchema.js');

router.get('/weekly/:studentId', async (req, res) => {
   
    try {
      const studentId = req.params.studentId;
      logger.info(' .recived request to generate timetable for student with id: ' + studentId);
  
      // Find the student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: " .Student not found" });
      }
      logger.info(' .student found in db');
      // Get enrolled courses for the student
      const enrolledCourses = student.enrolledCourses;
  
      // Constructing timetable
      let timetable = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      };
      for (const courseId of enrolledCourses) {
        logger.info('  ..for loop  schedules  : courseId ' + courseId);
        const course = await Course.findById(courseId);
        logger.info('  ..course found in db with id: ' + course.Ccode);
        //no need to check if course exists as student can only enroll in existing courses
  

        const scheduleId = course.schedule;
        logger.info('  ..for loop started ' + scheduleId);
        for (const id of scheduleId) {
          logger.info('   ...for loop schedules   : scheduleId ' + scheduleId);
          const schedule = await Booking.findById(id);
          logger.info('   ...schedule found for course with type: ' + schedule.Type);

          const dayOfWeek = new Date(schedule.BookedDay).toLocaleString('en-us', { weekday: 'short' });

          // in here Check if the array for the day of the week exists, if not, initialize it
          if (!timetable[dayOfWeek]) {
            timetable[dayOfWeek] = [];
          }

          // letzz Push the schedule information into the timetable array for the day of the week
          timetable[dayOfWeek].push({
            startDate: schedule.StartTime,
            endDate: schedule.EndTime,
            moduleName: course.description,
            code: course.Ccode
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
