const express = require("express");

const TestSeries = require("../models/testSeries");
const TestSeriesEnrollments = require("../models/testSeriesEnrolments");
const Student = require("../models/student");
const Test = require("../models/test");

const testSeriesRouter = express.Router();
const testSeriesPerPage = 2;
const mongoose = require("mongoose");
const testSeriesValidator = require("../helpers/testSeriesHelpers");
const testValidator = require("../helpers/testHelper");

require("dotenv").config();

//Handling Test Series
testSeriesRouter
  .route("/:page")
  .get((req, res, next) => {
    const page = req.params.page;
    if (!page) {
      res.send([]);
    } else {
      TestSeries.find({})
        .skip(page * testSeriesPerPage)
        .limit(testSeriesPerPage)
        .then(
          (testSeriess) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(testSeriess);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  })
  .post((req, res, next) => {
    const data = req.body;

    //Check if user is authorized to create a test series or not, skipped for now

    //Validation of Data, Skipped for Now
    if (!testSeriesValidator(data)) {
      res.send("Invalid Data");
      res.status(501);
    }

    //Creating New Test Series
    TestSeries.create(data)
      .then((success) => {
        res.send(success);
        res.status(200);
      })
      .catch((err) => {
        res.send("Adding Test Series Failed");
        res.status(501);
      });
  })
  .delete((req, res, next) => {
    //Delete a particular test series
  });

//Handling Single Tests
testSeriesRouter
  .route("/test/:testId")
  .get((req, res, next) => {

      TestSeries.findById(req.params.testId).populate("tests")
        .then(
          (testSeriess) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(testSeriess);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
  })
  .post((req, res, next) => {
    const data = req.body;

    //Check if user is authorized to create a test or not, skipped for now

    //Validation of Data, Skipped for Now
    if (!testSeriesValidator(data)) {
      res.send("Invalid Data");
      res.status(501);
    }

    //Creating New Test Series
    Test.create(data)
      .then((success) => {
        res.send(success);
        res.status(200);
      })
      .catch((err) => {
        res.send("Adding Test Failed");
        res.status(501);
      });
  })
  .delete((req, res, next) => {
    //Delete a particular test
  });

//Handling Test Series Enrollment
testSeriesRouter
  .route("/enroll/:testSeriesId/student/:studentId")
  .get((req, res, next) => {
    res.send("ok");
  })
  .post((req, res, next) => {
    const testSeriesId = req.params.testSeriesId;
    const studentId = req.params.studentId;

    //Checking if user is already enrolled
    let check = TestSeriesEnrollments.exists({
      student: studentId,
      testseries: testSeriesId,
    });

    if (!check) {
      //validating if Test Series Exist
      TestSeries.findById(testSeriesId)
        .then((testSeries) => {
          //Checking if student exists
          Student.findById(studentId)
            .then((student) => {
              //Creating a Test Series Enrollment

              var join_date = new Date();
              var last_date = new Date();
              last_date.setDate(join_date.getDate() + testSeries.days);
              const newEnrollment = {
                testseries: mongoose.Types.ObjectId(testSeriesId),
                student: mongoose.Types.ObjectId(studentId),
                join_date: join_date,
                last_date: last_date,
                test_progress: [],
              };

              TestSeriesEnrollments.create(newEnrollment)
                .then((data) => {
                  res.status(200);
                  res.send(data);
                })
                .catch((err) => {
                  res.send("Enrollment Failed");
                  res.status(301);
                });

              //Adding Test Series to Student
              Student.findByIdAndUpdate(studentId, {
                series_enrolled: [testSeriesId],
              });
            })
            .catch((err) => {
              res.status(501);
              res.send("Student Does not Exist");
              next(err);
            });
        })
        .catch((err) => {
          res.status(501);
          res.send("Test Series Does not Exist");
          next(err);
        });
    } else {
      res.send("Already Enrolled");
    }
  });

module.exports = testSeriesRouter;
