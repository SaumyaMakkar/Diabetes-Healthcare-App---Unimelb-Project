const express = require('express')

// create our Router object
const patientProfileRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const utilsController = require('../controllers/utilsController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for all demo data
patientProfileRouter.get('/', isAuthenticated, hasRole("patient"), patientController.getPatientProfile)

// add a new JSON object to the database
patientProfileRouter.post('/getGraphData', (req, res, next) => {
    console.log("getGraphData")
    console.log(req.body)
    utilsController.getGraphData(req, res, next)
})

// add a new JSON object to the database
patientProfileRouter.post('/updateProfile', isAuthenticated, (req, res) => {
    console.log("updateProfile")
    patientController.updateProfile(req, res)
})

// add a new JSON object to the database
patientProfileRouter.post('/updatePassword', isAuthenticated, (req, res) => {
    console.log("updatePassword")
    patientController.updatePassword(req, res)
})

// export the router
module.exports = patientProfileRouter