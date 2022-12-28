const express = require("express");

const Course = require("../models/course");
const CourseEnrollments = require("../models/courseEnrollments");
const CourseProgress = require("../models/courseProgress");

const Student = require("../models/student");
const courseRouter = express.Router();
const coursePerPage = 2;
const passport = require("passport");

const mongoose = require("mongoose");

require("dotenv").config();

//Handling Courses
courseRouter.route("/:page").get((req, res, next) => {
  const page = req.params.page;
  if (!page) {
    res.send([]);
  } else {
    Course.find({})
      .skip(page * coursePerPage)
      .limit(coursePerPage)
      .then(
        (courses) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(courses);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
});

//Handling Single Course
courseRouter
  .route("/course/:courseId")
  .get((req, res, next) => {
    const page = 0;

    Course.findById(req.params.courseId)
      .skip(page * coursePerPage)
      .limit(coursePerPage)
      .populate("instructors")
      .populate("modules")
      .populate("resources")
      .populate({ path: "modules", populate: { path: "resources" } })
      .then(
        (courses) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(courses);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    const data = req.body;

    //Check if user is authorized to create a course or not

    //Validate course data, skipping for now

    //Adding a course
    Course.create(data)
      .then((courseCreated) => {
        res.status(200);
        res.send(courseCreated);
      })
      .catch((err) => {
        res.status(501);
        res.send(err);
      });
  })
  .delete((req, res, next) => {
    //Delete a particular course
  });

//Handling Enrollment of a student in a course
courseRouter
  .route("/enroll/:courseId/")
  .post(
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      const courseId = req.params.courseId;
      const studentId = req.user._id;

      //Checking if student is already enrolled
      let check = await CourseEnrollments.exists({
        course: courseId,
        student: studentId,
      });

      if (!check) {
        Course.findById(courseId)
          .then((courseFetched) => {
            if (!courseFetched) {
              res.send("Invalid Course");
            } else {
              Student.findById(studentId)
                .then((student) => {
                  if (student) {
                    var join_date = new Date();
                    var last_date = new Date();

                    last_date.setDate(join_date.getDate() + courseFetched.days);

                    const newEnrollment = {
                      course: mongoose.Types.ObjectId(courseId),
                      student: mongoose.Types.ObjectId(studentId),
                      join_date: join_date,
                      last_date: last_date,
                    };

                    //Enrolling Student in Course

                    CourseEnrollments.create(newEnrollment)
                      .then((enrollment) => {
                        //Create Course Progress Document Here After the User is successfully Enrolled
                        CourseProgress.create({
                          course: courseId,
                          student: studentId,
                          statusMap: [],
                        })
                          .then((courseProgressSaved) => {
                            res.status(200);
                            res.send("Successfully Enrolled");
                          })
                          .catch((err) => {
                            res.status(501);
                            res.send(err);
                          });
                      })
                      .catch((err) => {
                        res.status(501);
                        res.send(err);
                      });
                  } else {
                    res.send("Student Does Not Exist");
                  }
                })
                .catch((err) => {
                  res.status(501);
                  res.send(err);
                });
            }
          })
          .catch((err) => {
            res.status(501);
            res.send("Course Not Found");
          });
      } else {
        res.send("Already Enrolled");
      }
    }
  );

module.exports = courseRouter;
