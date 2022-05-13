const passport = require('passport')
const express = require('express')
const router = express.Router()

// add Express-Validator
const { body, validationResult, check } = require('express-validator')
// require userController controller
const userController = require('../controllers/userController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')
const { validator } = require('../middleware/validator.js')


// Handle login
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login', failureFlash: true
    }),
    (req, res) => {
        console.log('user ' + req.user.username + ' logged in with role ' + req.user.role)     // for debugging
        if (req.user.role == "patient") {
            res.redirect('/patient_home')
        } else {
            res.redirect('/clinician_dashboard')
        }
    }
)

// Handle password
router.post('/updatePassword', isAuthenticated,
    check('newPassword', "must be at least 8 characters long").isLength({ min: 8 }),
    hasRole("patient"),
    validator,
    (req, res) => {
        
        console.log("/updatePassword")
        userController.updatePassword(req, res)
    })

// Handle updateTheme
router.post('/updateTheme', userController.updateTheme)

// Handle logout
router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router