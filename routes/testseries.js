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
const isEnrolled = require("../middlewares/isEnrolled");

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

testSeriesRouter
  .route("/test/:testSeriesId/:testId")
  .get(VerifyToken, isEnrolled, async (req, res, next) => {
    try {
      const test = await Test.findById(req.params.testId)
        .populate({
          path: "sections",
          populate: {
            path: "questions",
          },
        })
        .exec();

      res.status(200).json(test);
    } catch (error) {
      next(error);
    }
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

    const student = req.student._id;
    const testSeriesId = req.params.testSeriesId;

    new TestProgress({
      test: testId,
      testseries: testSeriesId,
      student: student,
      answer_map: answer_map,
      time_taken: req.body.time_taken,
      score: score,
      correct: req.body.correct,
      wrong: req.body.wrong,
      unanswered: req.body.unanswered,
    })
      .save()
      .then((savedProgress) => {
        //Updating TestSeriesEnrollment
        TestSeriesEnrollments.findOne({
          student: student,
          testSeriesId: testSeriesId,
        }).then((enrollment) => {
          console.log(savedProgress._id);
          enrollment.test_progress.push({
            test: testId,
            test_progress: savedProgress._id,
          });

          enrollment.save().then(() => {
            res.send(savedProgress);
          });
        });
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

//Returning Single Test Series Progress
testSeriesRouter
  .route("/test-series-progress/:testSeriesId")
  .get(VerifyToken, (req, res, next) => {
    const testSeriesId = req.params.testSeriesId;
    TestProgress.find({ testseries: testSeriesId, student: req.student._id })
      .populate("test")
      .then((progresses) => {
        res.send(progresses);
      })
      .catch((err) => {
        res.send(err);
      });
  });

module.exports = testSeriesRouter;
