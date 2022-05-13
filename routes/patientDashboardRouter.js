const express = require('express')
const { check } = require('express-validator')

// create our Router object
const patientDashboardRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const { validator } = require('../middleware/validator.js')
const recordController = require('../controllers/recordController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for all demo data
patientDashboardRouter.get('/', isAuthenticated, hasRole('patient'), patientController.getPatientDashboard)

// add a new JSON object to the database
patientDashboardRouter.post('/insertRecord', isAuthenticated,
    check('healthType', "healthType is required").exists(),
    check('value', "value is required").exists(),
    validator,
    (req, res) => {
        recordController.insertRecord(req, res)
    })


// export the router
module.exports = patientDashboardRouter