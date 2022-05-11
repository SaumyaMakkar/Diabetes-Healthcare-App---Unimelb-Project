const express = require('express')

// create our Router object
const clinicianCommentsRouter = express.Router()

// require our controller
const clinicianController = require('../controllers/clinicianController')

// add a route to handle the GET request for all demo data
clinicianCommentsRouter.get('/', clinicianController.getAllPatientsComments)



// export the router
module.exports = clinicianCommentsRouter