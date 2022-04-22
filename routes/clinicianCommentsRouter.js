const express = require('express')

// create our Router object
const clinicianCommentsRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all demo data
clinicianCommentsRouter.get('/', patientController.getAllPatientsComments)



// export the router
module.exports = clinicianCommentsRouter