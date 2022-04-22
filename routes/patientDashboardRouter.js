const express = require('express')

// create our Router object
const patientDashboardRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const recordController = require('../controllers/recordController')

// add a route to handle the GET request for all demo data
patientDashboardRouter.get('/', patientController.getPatientDashboard)

// add a new JSON object to the database
patientDashboardRouter.post('/insertRecord', recordController.insertRecord)


// export the router
module.exports = patientDashboardRouter