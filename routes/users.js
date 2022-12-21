var express = require("express");
var studentRouter = express.Router();

const Student = require("../models/student");

/* GET users listing. */
studentRouter
  .get("/", function (req, res, next) {
    console.log(req.session);
    res.send("respond with a resource");
  })
  .post("/register", function (req, res, next) {
    const data = req.body;
  });

studentRouter
  .get("/student", function (req, res, next) {
    res.send("respond with a resource");
  })
  .post("/student/register", function (req, res, next) {
    const data = req.body;

    //Validation of Data, Skipped for Now

    //Creating New Test Series
    Student.create(data)
      .then((success) => {
        res.send(success);
        res.status(200);
      })
      .catch((err) => {
        res.send("Registering Student Failed");
        res.status(501);
      });
  });

module.exports = studentRouter;
