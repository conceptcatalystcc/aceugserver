const express = require("express");
const cmsRouter = express.Router();
const questionRouter = require("./cms/questions");
const loginRouter = require("./cms/login");
const verifyUserToken = require("../middlewares/verifyUserToken");
require("dotenv").config();

cmsRouter.use("/", loginRouter);
cmsRouter.use("/", verifyUserToken, questionRouter);

module.exports = cmsRouter;
