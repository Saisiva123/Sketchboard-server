const express = require('express');
const router = express.Router();
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const emailRouter = require("./email.route");
const boardRouter = require("./board.route");
const jwtAuthMiddleware = require("../middlewares/auth.middleware");

router.use("/auth", authRouter);
router.use("/users", jwtAuthMiddleware, userRouter);
router.use("/sendEmail", jwtAuthMiddleware, emailRouter);
router.use("/board", jwtAuthMiddleware, boardRouter);

module.exports = router