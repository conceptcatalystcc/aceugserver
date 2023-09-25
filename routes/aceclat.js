const express = require("express");
const verifyHost = require("../middlewares/verifyHost");
const aceclatRouter = express.Router();
const testSeriesRouter = require("./aceclat/testseries");
const studentRouter = require("./aceclat/student");
const loginRouter = require("./aceclat/sales/login");
const VerifyToken2 = require("../middlewares/VerifyToken2");
require("dotenv").config();

aceclatRouter.use("/testseries", VerifyToken2, verifyHost, testSeriesRouter);
aceclatRouter.use("/student", studentRouter);
aceclatRouter.use("/sales", loginRouter);

module.exports = aceclatRouter;
