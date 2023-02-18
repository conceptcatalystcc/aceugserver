const auth = require("../config/firebase-config");
const Student = require("../models/student");
const TestSeriesEnrollment = require("../models/testSeriesEnrolments");

const MaxAttempts = (req, res, next) => {
  try {
    const testSeriesId = req.params.testSeriesId;
    const studentId = req.student._id;

    TestSeriesEnrollment.findOne({
      testseries: testSeriesId,
      student: studentId,
    })
      .then((enrolled) => {
        if (enrolled) {
          return next;
        } else {
          return res.json({ message: "Not Enrolled" });
        }
      })
      .catch((err) => {
        return res.json({ message: err.toString() });
      });
    next();
  } catch (e) {
    return res.json({ message: e.toString() });
  }
};

module.exports = MaxAttempts;
