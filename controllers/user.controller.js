const User = require("../database/models/user.model");
const Board = require("../database/models/board.model");
const useEmailService = require("../utils/nodeMailerService");
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, '../' ,`.env.${process.env.NODE_ENV}`)
});

const getUsers = async (req, res, next) => {
    try {
        const result = await User.find({}, { email: 1 });
        return res.status(200).json({ message: result })
    }
    catch (err) {
        next(err)
    }
}

const sendEmail = async (req, res, next) => {
    const email = req.params.emailId;
    const fromEmail = req.user.email;

    const { boardId } = req.body;

    try {
        const boardSharedResult = await Board.updateOne({ _id: boardId }, { $push: { sharedTo: email } });
        const link = `${process.env.CLIENT_URL}/home/board?id=${boardId}`
        const result = await useEmailService(fromEmail, email, link);
        if (boardSharedResult['modifiedCount'] && result) {
            return res.status(200).json({ message: "Email Sent Successfully" })
        }
    }
    catch (err) {
        next(err)
    }
}

module.exports = { getUsers, sendEmail }