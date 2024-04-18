const User = require("../database/models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(200).json({
                status: 400,
                message: "It seems you already have an account, please log in instead.",
            });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email, password: hashedPassword
        })
        user.save().then(newUser => {
            if (newUser) {
                return res.status(200).json({ message: "User Created Sucessfully.", user: {email: newUser.email, id: newUser._id} })
            }
        })

    } catch (error) {
        return res.json({ data: error.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({status: 400, message: "Email provided does not exist" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(200).json({ staus: 401, message: "Password is not valid" });
        }

        const token = jwt.sign({ email: user.email }, "your_secret_key_1234", { expiresIn: "1d" });
        return res.status(200).json({ message: "Login Successful", email: user.email, token });
    }
    catch (err) {
        return res.status(500).json({err: err.message, message: "Something went wrong while logging in" });
    }
}


module.exports = { signup, login }