const auth = require("../config/firebase-config");
const Student = require("../models/student");
const TestSeriesEnrollments = require("../models/testSeriesEnrolments");

const AlreadyEnrolled = async (req, res, next) => {
  try {
    const items = req.body.items;
    const testSeries = items
      .filter((item) => item.type === "Test Series")
      .map((item) => item.id);
    console.log("Found");
    testSeries.forEach((series) => {
      TestSeriesEnrollments.findOne({
        testseries: series,
        student: req.student._id,
      }).then((found) => {
        console.log(found);
        if (found) {
          return next(new Error("Already Enrolled"));
        } else {
          return next();
        }
      });
    });
  } catch (e) {
    console.log(e);
    return res.json({ message: e.toString() });
  }
};

module.exports = AlreadyEnrolled;
