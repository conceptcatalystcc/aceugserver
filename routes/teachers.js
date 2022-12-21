var express = require("express");
var teacherRouter = express.Router();

const Teacher = require("../models/teacher");

/* GET users listing. */
teacherRouter
  .get("/", function (req, res, next) {
    res.send("respond with a resource");
  })
  .post("/register", function (req, res, next) {
    const data = req.body;
  });

teacherRouter
  .get("/teacher", function (req, res, next) {
    res.send("respond with a resource");
  })
  .post("/teacher/register", function (req, res, next) {
    const data = req.body;

    //Validation of Data, Skipped for Now

    //Creating New Test Series
    Teacher.create(data)
      .then((success) => {
        res.send(success);
        res.status(200);
      })
      .catch((err) => {
        res.send("Registering Teacher Failed");
        res.status(501);
      });
  });

module.exports = teacherRouter;
