
# TimeTide

## Description

A brief description of the project.

## Installation

Instructions on how to install and run the project.

## Usage

Instructions on how to use the project.

## problems
problems have been addressed
1.mongodb schema designing : circular reference between 

## Contributing

Guidelines for contributing to the project.

## License

Information about the project's license.

## Contact

Contact information for the project maintainer.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)

student can view timetable for selected module
time table is weekly basis, not day to day basis


// UserRoles Collection
UserRoles: {
  _id,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'lecturer', 'admin'], required: true },
  refObject: { type: ObjectId, refPath: 'role' }
}

// Lecturer Collection
Lecturer: {
  _id,
  honour: String,
  name: { type: String, required: true },
  contact_mail: String,
  contact_no: String
}

// Student Collection
Student: {
  _id,
  name: { type: String, required: true },
  regnb: { type: String, required: true },
  enrolledCourses: [{ type: ObjectId, ref: 'Course' }]
}

// Course Collection
Course: {
  _id,
  Ccode: { type: String, required: true },
  description: String,
  credits: Number,
  lecturerobjects: [{ type: ObjectId, ref: 'Lecturer' }],
  schedule: [{ type: ObjectId, ref: 'Bookings' }]
}

// Hall Collection
Hall: {
  _id,
  hallid: { type: String, required: true },
  buildingName: { type: String, required: true },
  floor: Number,
  resources: [{ type: ObjectId, ref: 'Resource' }]
}

// Resource Collection
Resource: {
  _id,
  name: { type: String, required: true },
  description: String,
  isAvailable: { type: Boolean, default: true }
}

// Bookings Collection
Bookings: {
  _id,
  StartTime: { type: Date, required: true },
  EndTime: { type: Date, required: true },
  BookedDay: { type: Date, required: true },
  Course: { type: ObjectId, ref: 'Course', required: true },
  Type: { type: String, enum: ['lab', 'lec', 'tute'], required: true },
  hall: { type: ObjectId, ref: 'Hall', required: true }
}

// Notification Collection
Notification: {
  _id,
  userID: { type: ObjectId, ref: 'UserRoles', required: true },
  message: String
}
