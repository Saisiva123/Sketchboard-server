const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const { signup, login } = require("../controllers/auth.controller");
const jwtAuthMiddleware = require("../middlewares/auth.middleware");
const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, '../', `.env.${process.env.NODE_ENV}`)
});


authRouter.post("/signup", signup);
authRouter.post("/login", login);

authRouter.get("/login/failed", (req,res) => {
    res.status(200).json({
        status: 401,
        message: 'unAuthorized'
    })
})
// Oauth using Google
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // this is just to invoke

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL + '/home' }), (req, res, next) => {
    console.log("invoked")
    const { email } = req.user;
    try{
        const payload = {email}
        console.log(payload)
        const token = jwt.sign(payload, "your_secret_key_1234", { expiresIn: '1d' })
        res.redirect(`${process.env.CLIENT_URL}/home?token=${encodeURIComponent(token)}&email=${email}`);
        // res.status(200).json({ message: "Sucessflly logged in", token, email })
    }
    catch(err)
    {
        next(new Error("Error while generating the JWT token"))
    }
});

// Oauth using Linkedin
authRouter.get('/linkedin',
  passport.authenticate('linkedin'));

  authRouter.get('/linkedin/callback', passport.authenticate('linkedin', { session: false}), (req, res, next) => {
    console.log("invoked linkedin")
    const { email } = req.user;
    try{
        const payload = {email}
        console.log(payload)
        const token = jwt.sign(payload, "your_secret_key_1234", { expiresIn: '1d' })
        res.status(200).json({ message: "Sucessflly logged in", token })
    }
    catch(err)
    {
        next(new Error("Error while generating the JWT token"))
    }
});


// Oauth using Github
authRouter.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

  authRouter.get('/github/callback', passport.authenticate('github', { failureRedirect: process.env.CLIENT_URL + '/home' }), (req, res, next) => {
    console.log("invoked Github")
    const { email } = req.user;
    try{
        const payload = {email}
        console.log(payload)
        const token = jwt.sign(payload, "your_secret_key_1234", { expiresIn: '1d' })
        res.redirect(`${process.env.CLIENT_URL}/home?token=${encodeURIComponent(token)}&email=${email}`);
    }
    catch(err)
    {
        next(new Error("Error while generating the JWT token"))
    }
});



module.exports = authRouter