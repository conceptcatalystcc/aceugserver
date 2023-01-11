const router = require("express").Router();
const auth = require("../config/firebase-config");
const Student = require("../models/student");

router.post("/register", async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const aspired_degree = req.body.aspired_degree;
  const aspired_college = req.body.password;
  console.log(email);
  const student = {
    email: email,
    phone: phone,
    name: name,
    aspired_college: aspired_college,
    aspired_degree: aspired_degree,
  };

  new Student(student)
    .save()
    .then((savedStudent) => {
      auth
        .createUser({
          displayName: savedStudent.name,
          email: savedStudent.email,
          phoneNumber: "+91" + savedStudent.phone,
        })
        .then((user) => {
          auth.setCustomUserClaims(uid, { mongo: savedStudent._id });
          res.send(user);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
