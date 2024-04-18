const express = require("express");
const emailRouter = express.Router();
const { sendEmail } = require("../controllers/user.controller");

emailRouter.post("/:emailId", sendEmail)

module.exports = emailRouter