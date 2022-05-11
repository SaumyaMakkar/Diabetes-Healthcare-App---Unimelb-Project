const express = require('express')

// create our Router object
const patientLeaderboardRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for one data instance
patientLeaderboardRouter.get('/', isAuthenticated, hasRole("patient"), patientController.getPatientLeaderboard)

// export the router
module.exports = patientLeaderboardRouter