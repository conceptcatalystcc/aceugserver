const CourseEnrollment = require("../models/courseEnrollments");
const TestSeriesEnrollment = require("../models/testSeriesEnrolments");

const checkEnrollment = async (req, res, next) => {
  req.item = req.body.items[0];
  console.log("[+] Checking if student is enrolled in " + req.item.type);
  try {
    const type = req.item.type; // assuming that req.item.type contains the type of the item ("Course" or "Test Series")
    const courseId = type === "Course" ? req.item.id : null; // assuming that req.item.id contains the course ID when type is "Course"
    const testSeriesId = type === "Test Series" ? req.item.id : null; // assuming that req.item.id contains the test series ID when type is "Test Series"
    const studentId = req.student._id; // assuming that req.user.id contains the user ID

    if (type === "Course") {
      const enrollment = await CourseEnrollment.findOne({
        course: courseId,
        student: studentId,
      });

      if (enrollment) {
        return res
          .status(400)
          .json({ message: "You are already enrolled in this course." });
      }
    } else if (type === "Test Series") {
      const enrollment = await TestSeriesEnrollment.findOne({
        testseries: testSeriesId,
        student: studentId,
      });

      if (enrollment) {
        return res
          .status(400)
          .json({ message: "You are already enrolled in this test series." });
      }
    } else {
      return res.status(400).json({ message: "Invalid item type." });
    }

    console.log("[+] Not Enrolled - Next ");
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while checking enrollment." });
  }
};

module.exports = checkEnrollment;
