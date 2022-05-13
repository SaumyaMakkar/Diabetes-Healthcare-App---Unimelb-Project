const express = require('express')
const { body, validationResult, check } = require('express-validator')

// create our Router object
const clinicianPatientRouter = express.Router()

// require our controller
const clinicianController = require('../controllers/clinicianController')
const patientController = require('../controllers/patientController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')
const { validator } = require('../middleware/validator.js')

// add a route to handle the GET request for all demo data
clinicianPatientRouter.get('/', isAuthenticated, hasRole('clinician'), clinicianController.getAllPatients)

// add a route to handle the GET request for one data instance
clinicianPatientRouter.get('/:id/clinician_patient_data/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientHealthDataById)
clinicianPatientRouter.get('/:id/clinician_patient_support_messages/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientSupportMessagesById)
clinicianPatientRouter.get('/:id/clinician_patient_notes/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientClinicalNotesById)
clinicianPatientRouter.get('/:id/clinician_patient_profile/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientProfileById)

// add a new JSON object to the database

clinicianPatientRouter.post('/insertPatient', isAuthenticated, hasRole('clinician'),
    check('email', "email is required").exists(),
    check('password', "must be at least 8 characters long").isLength({ min: 8 }),
    check('givenName', "givenName is required").exists(),
    check('familyName', "familyName is required").exists(),
    check('screenName', "screenName is required").exists(),
    check('yearOfBirth', "yearOfBirth is required").exists(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const [msg] = errors.array({ onlyFirstError: true });
            res.redirect('/clinician_dashboard')
        } else {
            clinicianController.insertPatient(req, res, next);
        }
    })

// add a new JSON object to the database
clinicianPatientRouter.post('/updateSettings/:id', isAuthenticated, hasRole('clinician'), clinicianController.updateSettings)

clinicianPatientRouter.post('/insertSupportMessage/:id', isAuthenticated, hasRole('clinician'), clinicianController.insertSupportMessage)
clinicianPatientRouter.post('/insertClinicalNote/:id', isAuthenticated, hasRole('clinician'), clinicianController.insertClinicalNote)



// export the router
module.exports = clinicianPatientRouter