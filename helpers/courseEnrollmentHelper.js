const Course = require("../models/course");
const CourseEnrollments = require("../models/courseEnrollments");
const CourseProgress = require("../models/courseProgress");
const mongoose = require("mongoose");
const Student = require("../models/student");

const enrollStudent = async (studentId, courseId) => {



  
  const enrolled = {
    status: false,
    msg: "",
  };
  //Checking if student is already enrolled
  let alreadyEnrolledCheck = await CourseEnrollments.exists({
    course: courseId,
    student: studentId,
  });

  //Checking if studentid is correct
  let validStudentCheck = await Student.exists({
    id: studentId,
  });

  //Checking if course id is correct
  let validCourseCheck = await Course.exists({
    id: courseId,
  });
  console.log(alreadyEnrolledCheck, validCourseCheck, validStudentCheck);

  if (!alreadyEnrolledCheck) {
    Course.findById(courseId)
      .then((course) => {
        console.log(course);
        Student.findById(studentId)
          .then((student) => {
            console.log("Loaded Student");
            var join_date = new Date();
            var last_date = new Date();

            last_date.setDate(join_date.getDate() + course.days);
            console.log("Created Last Date");
            const newEnrollment = {
              course: mongoose.Types.ObjectId(courseId),
              student: mongoose.Types.ObjectId(studentId),
              join_date: join_date,
              last_date: last_date,
            };

            //Enrolling Student in Course
            console.log("Created New enrollment");
            CourseEnrollments.create(newEnrollment)
              .then((enrollment) => {
                //Create Course Progress Document Here After the User is successfully Enrolled
                CourseProgress.create({
                  course: courseId,
                  student: studentId,
                  statusMap: [],
                })
                  .then((courseProgressSaved) => {
                    //Adding course in student
                    student.courses_enrolled.push(courseId);
                    student.save();
                    console.log("Saved ");
                    return {
                      ...enrolled,
                      status: true,
                      msg: "Successfully Enrolled",
                    };
                  })
                  .catch((err) => {
                    return { ...enrolled, msg: err };
                  });
              })
              .catch((err) => {
                return { ...enrolled, msg: err };
              });
          })
          .catch((err) => {
            return { ...enrolled, msg: err };
          });
      })
      .catch((err) => {
        return { ...enrolled, msg: "Course Not Found" };
      });
  } else {
    return { ...enrolled, msg: "Already Enrolled" };
  }
};

module.exports.enrollStudent = enrollStudent;