const express = require('express')

// create our Router object
const patientRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all demo data
patientRouter.get('/', patientController.getAllPatients)

// add a route to handle the GET request for one data instance
patientRouter.get('/:id', patientController.getPatientById)

// add a new JSON object to the database
patientRouter.post('/', patientController.insertPatient)

// export the router
module.exports = patientRouter