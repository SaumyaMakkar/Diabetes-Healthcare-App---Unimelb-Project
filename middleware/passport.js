// set up Passport

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/users')

// Updated serialize/deserialize functions
passport.serializeUser((user, done) => {
    console.log("serializeUser")
    done(undefined, user._id)
})

passport.deserializeUser((userId, done) => {
    console.log("deserializeUser")
    User.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})

// Set up "local" strategy, i.e. authentication based on username/password. There are other types of strategy too.

var strategy = new LocalStrategy((username, password, cb) => {

    console.log("LocalStrategy..");
    // first, check if there is a user in the db with this username
    User.findOne({ username: username }, {}, {}, (err, user) => {
        if (err) { return cb(null, false, { message: 'Unknown error.' }) }
        if (!user) { return cb(null, false, { message: 'Incorrect email.' }) }
        // if there is a user with this username, check if the password matches
        user.verifyPassword(password, (err, valid) => {
            if (err) { return cb(null, false, { message: 'Unknown error.' }) }
            if (!valid) { return cb(null, false, { message: 'Incorrect password.' }) }
            return cb(null, user)
        })
    })
})


passport.use(strategy)

module.exports =  passport