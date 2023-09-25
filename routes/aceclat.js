const express = require("express");
const verifyHost = require("../middlewares/verifyHost");
const aceclatRouter = express.Router();
const testSeriesRouter = require("./jamboree/testseries");
const studentRouter = require("./jamboree/student");
const loginRouter = require("./jamboree/sales/login");
const VerifyToken2 = require("../middlewares/VerifyToken2");
require("dotenv").config();

aceclatRouter.use("/testseries", VerifyToken2, verifyHost, testSeriesRouter);
aceclatRouter.use("/student", studentRouter);
aceclatRouter.use("/sales", loginRouter);

module.exports = aceclatRouter;
