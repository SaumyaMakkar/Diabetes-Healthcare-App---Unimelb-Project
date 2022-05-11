const express = require('express')

// create our Router object
const patientDashboardRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const recordController = require('../controllers/recordController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for all demo data
patientDashboardRouter.get('/', isAuthenticated, hasRole('patient'), patientController.getPatientDashboard)

// add a new JSON object to the database
patientDashboardRouter.post('/insertRecord', isAuthenticated, (req, res) => {
    recordController.insertRecord(req, res)
})


// export the router
module.exports = patientDashboardRouter