const express = require("express");
const verifyHost = require("../middlewares/verifyHost");
const jamboreeRouter = express.Router();
const testSeriesRouter = require("./jamboree/testseries");
const studentRouter = require("./jamboree/student");
const loginRouter = require("./jamboree/sales/login");
const VerifyToken2 = require("../middlewares/VerifyToken2");
require("dotenv").config();

jamboreeRouter.use("/testseries", VerifyToken2, verifyHost, testSeriesRouter);
jamboreeRouter.use("/student", studentRouter);
jamboreeRouter.use("/sales", loginRouter);

module.exports = jamboreeRouter;
