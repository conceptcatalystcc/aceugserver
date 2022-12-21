const express = require("express");

const CourseProgress = require("../models/courseProgress");
const Student = require("../models/student");
const Course = require("../models/course");
const progressRouter = express.Router();

require("dotenv").config();

progressRouter.route("/:progressId").get((req, res, next) => {
  const progressId = req.params.progressId;

  CourseProgress.findById(progressId)
    .then((progress) => {
      res.status(200);
      res.send(progress);
    })
    .catch((err) => {
      res.status(501);
      res.send(err);
    });
});

progressRouter
  .route("/saveprogress/:courseId/student/:studentId")
  .get((req, res, next) => {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;

    Student.findById(studentId)
      .then((student) => {
        Course.findById(courseId)
          .then((test) => {
            //If A student if trying to submit more than no of times allowed

            //Saving Course Progress
            const data = req.body;

            CourseProgress.create(data)
              .then((progressSaved) => {
                res.status(200);
                res.send(progressSaved);
              })
              .catch((err) => {
                res.status(501);
                res.send(err);
              });
          })
          .catch((err) => {
            res.status(301);
            res.send("Course Not Found");
          });
      })
      .catch((err) => {
        res.status(301);
        res.send("Student not found");
      });
  });

module.exports = progressRouter;
