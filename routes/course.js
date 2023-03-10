const express = require("express");

const Course = require("../models/course");
const CourseEnrollments = require("../models/courseEnrollments");
const CourseProgress = require("../models/courseProgress");

const Student = require("../models/student");
const courseRouter = express.Router();
const coursePerPage = 2;
const passport = require("passport");

const mongoose = require("mongoose");
const VerifyToken = require("../middlewares/VerifyToken");

require("dotenv").config();

//Handling Courses
courseRouter.route("/:page").get((req, res, next) => {
  const page = req.params.page;
  if (!page) {
    res.send([]);
  } else {
    Course.find({})
      .skip(page * coursePerPage)
      .limit(coursePerPage)
      .populate("thumbnail")
      .then(
        (courses) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(courses);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
});

//Handling Single Course
courseRouter.route("/course/:courseId").get((req, res, next) => {
  const page = 0;

  Course.findById(req.params.courseId)
    .skip(page * coursePerPage)
    .limit(coursePerPage)
    .populate("instructors")
    .populate("modules")
    .populate({ path: "modules", populate: { path: "resources" } })
    .then(
      (courses) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(courses);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//Handling Single Course
courseRouter.route("/attempt/:courseId").get((req, res, next) => {
  const page = 0;

  Course.findById(req.params.courseId)
    .skip(page * coursePerPage)
    .limit(coursePerPage)
    .populate("instructors")
    .populate("modules")
    .populate({ path: "modules", populate: { path: "resources" } })
    .populate({
      path: "modules",
      populate: { path: "resources", populate: { path: "lesson" } },
    })
    .populate({
      path: "modules",
      populate: { path: "resources", populate: { path: "video" } },
    })
    .populate({
      path: "modules",
      populate: { path: "resources", populate: { path: "quiz" } },
    })
    .then(
      (courses) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(courses);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = courseRouter;
