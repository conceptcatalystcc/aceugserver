const express = require("express");

const TestSeries = require("../../models/testseries");
const TestSeriesEnrollments = require("../../models/testSeriesEnrolments");
const Test = require("../../models/test");
const TestProgress = require("../../models/testProgress");

const testSeriesRouter = express.Router();
const testSeriesPerPage = 2;
const VerifyToken = require("../../middlewares/VerifyToken");
const isEnrolled = require("../../middlewares/isEnrolled");

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
testSeriesRouter.route("/singletestseries/:id").get(async (req, res, next) => {
  const id = req.params.id;

  try {
    const testSeries = await TestSeries.findById(id)
      .populate("tests")
      .populate("distributors");
    if (!testSeries) {
      return res.status(404).json({ error: "Test series not found" });
    }

    // Check if req.get("origin") is in any of the distributors' domains of test series
    const distributors = testSeries.distributors;
    if (!distributors || distributors.length === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    const allowedDomains = distributors.map(
      (distributor) => distributor.domain
    );
    const requestDomain = req.get("origin");

    if (allowedDomains.some((domain) => requestDomain.includes(domain))) {
      return res.json(testSeries);
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

testSeriesRouter
  .route("/test/:testSeriesId/:testId")
  .get(isEnrolled, async (req, res, next) => {
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

//Creating Single Test Submission/Progress
testSeriesRouter
  .route("/submit-test/:testSeriesId/:testId")
  .post(async (req, res, next) => {
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
  .get((req, res, next) => {
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
