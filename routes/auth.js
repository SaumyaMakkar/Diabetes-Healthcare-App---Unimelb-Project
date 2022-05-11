const passport = require('passport')
const express = require('express')
const router = express.Router()

// require userController controller
const userController = require('../controllers/userController')


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
router.post('/updatePatientDetails', userController.updatePatientDetails)
// Handle password
router.post('/updatePassword', userController.updatePassword)

// Handle updateTheme
router.post('/updateTheme', userController.updateTheme)

// Handle logout
router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router