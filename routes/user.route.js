const express = require("express");
const userRouter = express.Router();
const { getUsers } = require("../controllers/user.controller");


userRouter.get("/", getUsers);

module.exports = userRouter