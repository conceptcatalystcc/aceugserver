const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Student = require("../models/student");
const validPassword = require("../helpers/passwordHelpers").validPassword;

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = (studentname, password, done) => {
  console.log("student");
  Student.findOne({ email: studentname })
    .then((student) => {
      if (!student) {
        return done(null, false);
      }

      const isValid = validPassword(password, student.hash, student.salt);

      if (isValid) {
        return done(null, student);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((student, done) => {
  done(null, student.id);
});

passport.deserializeUser((studentId, done) => {
  Student.findById(studentId)
    .then((student) => {
      done(null, student);
    })
    .catch((err) => done(err));
});
