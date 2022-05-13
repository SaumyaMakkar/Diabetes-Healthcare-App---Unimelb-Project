const express = require('express')
// add Express-Validator
const { body, validationResult, check } = require('express-validator')

// create our Router object
const patientProfileRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const utilsController = require('../controllers/utilsController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')
const { validator } = require('../middleware/validator.js')

// add a route to handle the GET request for all demo data
patientProfileRouter.get('/',
    isAuthenticated,
    hasRole("patient"),
    patientController.getPatientProfile)

// add a new JSON object to the database
patientProfileRouter.post('/getGraphData',
    isAuthenticated,
    hasRole("patient"),
    (req, res, next) => {
        console.log("getGraphData")
        console.log(req.body)
        utilsController.getGraphData(req, res, next)
    })

// Handle password
patientProfileRouter.post('/updatePatientDetails', isAuthenticated,
    hasRole("patient"),
    check('givenName', "givenName is required").exists(),
    check('familyName', "familyName is required").exists(),
    validator,
    (req, res) => {
        console.log("updateProfile")
        patientController.updatePatientDetails(req, res)
    })

// add a new JSON object to the database
/* patientProfileRouter.post('/updateProfile', isAuthenticated,
    hasRole("patient"),
    (req, res) => {
        console.log("updateProfile")
        patientController.updateProfile(req, res)
    }) */

// export the router
module.exports = patientProfileRouter