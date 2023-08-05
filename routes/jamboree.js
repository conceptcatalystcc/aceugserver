const express = require("express");
const verifyHost = require("../middlewares/verifyHost");
const VerifyToken = require("../middlewares/VerifyToken");
const jamboreeRouter = express.Router();
const testSeriesRouter = require("./jamboree/testseries");
const studentRouter = require("./jamboree/student");
const VerifyToken2 = require("../middlewares/VerifyToken2");
require("dotenv").config();

jamboreeRouter.use("/testseries", VerifyToken2, verifyHost, testSeriesRouter);
jamboreeRouter.use("/student", studentRouter);

module.exports = jamboreeRouter;
