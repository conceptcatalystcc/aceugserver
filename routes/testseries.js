const express = require("express");

const TestSeries = require("../models/testseries");
const TestSeriesEnrollments = require("../models/testSeriesEnrolments");
const Student = require("../models/student");
const Test = require("../models/test");
const TestProgress = require("../models/testProgress");

const testSeriesRouter = express.Router();
const testSeriesPerPage = 2;
const mongoose = require("mongoose");
const Question = require("../models/question");
const VerifyToken = require("../middlewares/VerifyToken");

require("dotenv").config();

//Handling Test Series
testSeriesRouter.route("/:page").get((req, res, next) => {
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
});

//Handling Single Test Series
testSeriesRouter.route("/singletestseries/:id").get((req, res, next) => {
  const id = req.params.id;

  TestSeries.findById(id)
    .populate("tests")
    .then((testSeries) => {
      res.json(testSeries);
    })
    .catch((err) => {
      res.json(err);
    });
});

//Handling Single Test
testSeriesRouter
  .route("/test/:testSeriesId/:testId")
  .get(VerifyToken, (req, res, next) => {
    Test.findById(req.params.testId)
      .populate("sections")
      .populate({
        path: "sections",
        populate: {
          path: "questions",
        },
      })
      .then(
        (test) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send(test);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

const calculateScore = (answer_map) => {
  var score = 0;
  answer_map.map((answer) => {
    Question.findById(answer.question).then((question) => {
      question.options.map((option) => {
        if (option._id === answer.selected_option && option.correct) {
          score = score + question.pmarks;
          console.log("Score " + score);
        } else if (option._id === answer.selected_option && !option.correct) {
          score = score - question.nmarks;
          console.log("Score " + score);
        }
      });
    });
  });

  console.log(score);
  return score;
};
//Creating Single Test Submission/Progress
testSeriesRouter
  .route("/submit-test/:testSeriesId/:testId")
  .post(VerifyToken, async (req, res, next) => {
    const testId = req.params.testId;
    const answer_map = req.body.answer_map;
    const score = req.body.score;
    const time = req.body.time;

    const student = "63b67bf462f6d83a1898759f";
    const testSeriesId = req.params.testSeriesId;

    new TestProgress({
      test: testId,
      testseries: testSeriesId,
      student: student,
      answer_map: answer_map,
      time_taken: time,
      score: score,
    })
      .save()
      .then((savedProgress) => {
        res.send(savedProgress);
      })
      .catch((err) => {
        console.log(err);
        res.status(501);
        res.send(err);
      });
  });

//Returning Single Test Progress
testSeriesRouter.route("/test-report/:progressId").get((req, res, next) => {
  const progressId = req.params.progressId;
  TestProgress.findById(req.params.progressId)
    .populate("test")
    .populate({
      path: "test",
      populate: {
        path: "sections",
        populate: {
          path: "questions",
        },
      },
    })
    .then(
      (progress) => {
        //Fetching 50 latest progress reports for this test
        TestProgress.find({ test: progress.test._id })
          .limit(50)
          .then((latest_reports) => {
            // console.log(latest_reports);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(progress);
          });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
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
