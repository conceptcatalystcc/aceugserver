const express = require("express");

const TestProgress = require("../models/testProgress");
const Student = require("../models/student");
const Test = require("../models/test");
const progressRouter = express.Router();

require("dotenv").config();

progressRouter.route("/test-progress/:progressId").get((req, res, next) => {
  const progressId = req.params.progressId;

  TestProgress.findById(progressId)
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
  .route("/saveprogress/:testId/student/:studentId")
  .post((req, res, next) => {
    const testId = req.params.testId;
    const studentId = req.params.studentId;

    Student.findById(studentId)
      .then((student) => {
        Test.findById(testId)
          .then((test) => {
            //If A student if trying to submit more than no of times allowed

            //Saving Test Progress
            const data = req.body;

            TestProgress.create(data)
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
            res.send("Test Not Found");
          });
      })
      .catch((err) => {
        res.status(301);
        res.send("Student not found");
      });
  });

module.exports = progressRouter;
