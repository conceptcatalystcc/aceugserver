const router = require("express").Router();
const auth = require("../../config/firebase-config");
const VerifyToken2 = require("../../middlewares/VerifyToken2");
const Student = require("../../models/student");
const TestSeriesEnrolments = require("../../models/testSeriesEnrolments");
const TestProgress = require("../../models/testProgress");
const verifyHost = require("../../middlewares/verifyHost");

router.post("/register", async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const aspired_degree = req.body.aspired_degree;
  const aspired_college = req.body.aspired_college;
  const distributor = req.body.distributor;
  const uid = req.body.uid;

  try {
    // Check if the student is already registered
    const foundStudent = await Student.findOne({ phone: phone });
    if (foundStudent) {
      return res.send("User already Registered");
    }

    // Create a new student record
    const student = {
      email: email,
      phone: phone,
      name: name,
      aspired_college: aspired_college,
      aspired_degree: aspired_degree,
      uid: uid,
      distributor: distributor,
    };

    const savedStudent = await new Student(student).save();
    console.log(savedStudent);

    // Enroll the student in the test series
    const testSeriesId = "64c8b209f2faef6ea7b2fa44"; // Replace with the actual TestSeries ObjectId
    const enrollment = new TestSeriesEnrolments({
      student: savedStudent._id,
      testseries: testSeriesId,
      last_date: new Date(), // Set the last_date as per your requirements
    });

    await enrollment.save();

    res.status(200).send("Saved");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get(
  "/login-check/:number",
  VerifyToken2,
  verifyHost,
  (req, res, next) => {
    console.log("User Exist Check");
    const number = req.params.number;
    Student.findOne({ phone: number })
      .then((foundStudent) => {
        if (foundStudent) {
          res.json({ status: 1 });
        } else {
          console.log("User Not Found");
          res.json({ status: 0 });
        }
      })
      .catch((error) => res.send(error));
  }
);

router.get(
  "/testSeriesEnrolled",
  VerifyToken2,
  verifyHost,
  async (req, res, next) => {
    Student.findOne({ uid: req.user.uid }).then((student) => {
      TestSeriesEnrolments.find({ student: student._id })
        .populate("testseries")
        .then((enrollments) => {
          res.send(enrollments);
        });
    });
  }
);

router.get(
  "/recent-tests",
  VerifyToken2,
  verifyHost,
  async (req, res, next) => {
    Student.findOne({ uid: req.user.uid }).then((student) => {
      TestProgress.find({ student: student._id })
        .populate("test")
        .populate("testseries")
        .then((allProgress) => {
          res.send(allProgress);
        });
    });
  }
);

router.get("/profile", VerifyToken2, verifyHost, (req, res, next) => {
  res.send(req.student);
});

module.exports = router;
