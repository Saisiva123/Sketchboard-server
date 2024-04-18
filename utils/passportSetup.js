const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require("../database/models/user.model");
const path = require("path")
require('dotenv').config({
    path: path.join(__dirname, '../', `.env.${process.env.NODE_ENV}`)
});


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] }).then((currUser) => {
            if (currUser) {
                console.log("User already there", currUser)
                done(null, currUser)
            }
            else {
                const user = new User({
                    email: profile.emails[0].value,
                    googleId: profile.id
                })
                user.save().then(newUser => {
                    console.log("New user created successfully")
                    done(null, newUser)
                })
            }
        })
    }
));


const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile)
        User.findOne({ $or: [{ githubId: profile.id }, { email: profile.username.toLowerCase() + '@gmail.com' }] }).then((currUser) => {
            if (currUser) {
                console.log("User already there", currUser)
                done(null, currUser)
            }
            else {
                const user = new User({
                    email: profile.username.toLowerCase() + '@gmail.com',
                    githubId: profile.id
                })
                user.save().then(newUser => {
                    console.log("New user created successfully")
                    done(null, newUser)
                })
            }
        })
    }
));

const LINKEDIN_KEY = process.env.LINKEDIN_KEY
const LINKEDIN_SECRET = process.env.LINKEDIN_SECRET

passport.use(new LinkedInStrategy({
    clientID: LINKEDIN_KEY,
    clientSecret: LINKEDIN_SECRET,
    callbackURL: "/api/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
}, function (accessToken, refreshToken, profile, done) {

    User.findOne({ $or: [{ linkedinId: profile.id }, { email: profile.emails[0].value }] }).then((currUser) => {
        if (currUser) {
            console.log("User already there", currUser)
            done(null, currUser)
        }
        else {
            const user = new User({
                email: profile.emails[0].value,
                linkedinId: profile.id
            })
            user.save().then(newUser => {
                console.log("New user created successfully")
                done(null, newUser)
            })
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user); // or user._id if you are using MongoDB
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
