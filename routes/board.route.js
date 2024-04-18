const express = require("express");
const boardRouter = express.Router();
const { getBoards, createBoard, getBoardDetails, updateBoard } = require("../controllers/board.controller");

boardRouter.post("/", createBoard)
boardRouter.get("/", getBoards)
boardRouter.get("/:boardId", getBoardDetails)
boardRouter.post("/:boardId", updateBoard)

module.exports = boardRouter