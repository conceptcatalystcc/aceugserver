const router = require("express").Router();
const auth = require("../config/firebase-config");
const VerifyToken = require("../middlewares/VerifyToken");
const Student = require("../models/student");
const TestSeriesEnrolments = require("../models/testSeriesEnrolments");
const TestProgress = require("../models/testProgress");

router.post("/register", async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const aspired_degree = req.body.aspired_degree;
  const aspired_college = req.body.aspired_college;
  const uid = req.body.uid;

  Student.findOne({ phone: phone })
    .then((foundStudent) => {
      if (foundStudent) {
        res.send("User already Registered");
      } else {
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
      }
    })
    .catch((error) => res.send(error));
});

router.get("/login-check/:number", (req, res, next) => {
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

router.get("/recent-tests", VerifyToken, async (req, res, next) => {
  Student.findOne({ uid: req.user.uid }).then((student) => {
    TestProgress.find({ student: student._id })
      .populate("test")
      .populate("testseries")
      .then((allProgress) => {
        res.send(allProgress);
      });
  });
});

router.get("/profile", VerifyToken, (req, res, next) => {
  res.send(req.student);
});

module.exports = router;
