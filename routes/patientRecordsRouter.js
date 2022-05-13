const express = require('express')

// create our Router object
const patientRecordsRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for one data instance
patientRecordsRouter.get('/', isAuthenticated,
    hasRole("patient"),
    patientController.getPatientHealthDataByUserId)

// export the router
module.exports = patientRecordsRouter