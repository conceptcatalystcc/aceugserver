const TestSeriesEnrollment = require("../models/testSeriesEnrolments");

const isEnrolled = async (req, res, next) => {
  try {
    const testSeriesId = req.params.testSeriesId;
    const studentId = req.student._id;

    const enrolled = await TestSeriesEnrollment.findOne({
      testseries: testSeriesId,
      student: studentId,
    }).exec();

    if (enrolled) {
      console.log("Student is Enrolled");
      next();
    } else {
      console.log("Student is Not Enrolled");
      return res
        .status(403)
        .json({ errorCode: "NOT_ENROLLED", message: "Not Enrolled" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: error.toString() });
  }
};

module.exports = isEnrolled;
