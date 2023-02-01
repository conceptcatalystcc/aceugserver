const router = require("express").Router();
const auth = require("../config/firebase-config");
const VerifyToken = require("../middlewares/VerifyToken");
const Student = require("../models/student");
const TestSeriesEnrolments = require("../models/testSeriesEnrolments");

router.post("/register", async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const aspired_degree = req.body.aspired_degree;
  const aspired_college = req.body.aspired_college;
  const uid = req.body.uid;

  const student = {
    email: email,
    phone: phone,
    name: name,
    aspired_college: aspired_college,
    aspired_degree: aspired_degree,
    uid: uid,
  };

  new Student(student)
    .save()
    .then((savedStudent) => {
      console.log(savedStudent);
      res.status(200);
      res.send("Saved");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/testSeriesEnrolled", VerifyToken, async (req, res, next) => {
  Student.findOne({ uid: req.user.uid }).then((student) => {
    TestSeriesEnrolments.find({ student: student._id })
      .populate("testseries")
      .then((enrollments) => {
        res.send(enrollments);
      });
  });
});

module.exports = router;
