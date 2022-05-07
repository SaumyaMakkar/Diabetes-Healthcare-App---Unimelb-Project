const express = require('express')

// create our Router object
const patientRecordsRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for one data instance
patientRecordsRouter.get('/', patientController.getPatientHealthDataByManualId)

// export the router
module.exports = patientRecordsRouter