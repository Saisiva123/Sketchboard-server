const Board = require("../database/models/board.model");

const createBoard = async (req, res, next) => {
   try {
      const email = req.user.email
      const board = new Board({ state: "", createdUser: email, sharedTo: [], isReadOnly: false })
      const { createdUser, _id } = await board.save();

      return res.status(201).json({ message: { createdUser, _id } });
   }
   catch (err) {
      next(err)
   }
}

const getBoards = async (req, res, next) => {
   try {
      const email = req.user.email
      let result = await Board.find({ $or: [{ createdUser: email }, { sharedTo: { $in: [email] } }] }, { _id: 1, createdUser: 1, sharedTo: 1, isReadOnly: 1 });
      return res.status(201).json({ message: result });
   }
   catch (err) {
      next(err)
   }
}

const getBoardDetails = async (req, res, next) => {
   try {
      const boardId = req.params.boardId;
      const board = await Board.findOne({ _id: boardId }, { _id: 1, state: 1, createdUser: 1, isReadOnly: 1 });
      return res.status(200).json({ message: board });
   }
   catch (err) {
      next(err)
   }
}


const updateBoard = async (req, res, next) => {
   try {
      const boardId = req.params.boardId;
      const result = req.body?.state ? await Board.updateOne({ _id: boardId }, { $set: { state: req.body?.state } }) :
         await Board.updateOne({ _id: boardId }, { $set: { isReadOnly: req.body?.isReadOnly } })
      if (result.acknowledged && result.modifiedCount) {
         return res.status(200).json({ message: "Saved Successfully" });
      }

   }
   catch (err) {
      next(err)
   }
}




module.exports = { createBoard, getBoards, getBoardDetails, updateBoard }