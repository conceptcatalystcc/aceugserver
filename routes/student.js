const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../helpers/passwordHelpers").genPassword;
const validPassword = require("../helpers/passwordHelpers").validPassword;
const utils = require("../helpers/utils");

const Student = require("../models/student");

/**
 * -------------- POST ROUTES ----------------
 */

router.post("/login", (req, res, next) => {
  Student.findOne({ email: req.body.email })
    .then((student) => {
      if (!student) {
        return done(null, false);
      }

      const isValid = validPassword(
        req.body.password,
        student.hash,
        student.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(student);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          // .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
});


router.post("/register", (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newStudent = new Student({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    hash: hash,
    salt: salt,
  });

  newStudent.save().then((student) => {
    console.log(student);
  });

  res.send({success: true, data:{message:"Successfully Registered"}});
});

router.route(
  "/profile").get(passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200);
    const userId = Student.findById(req.user._id).populate("courses_enrolled").then((student)=>{
      res.send(student)
    })
  }
);

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  res.redirect("/login");
});

module.exports = router;
