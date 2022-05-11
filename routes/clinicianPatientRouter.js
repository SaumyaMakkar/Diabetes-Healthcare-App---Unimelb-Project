const express = require('express')

// create our Router object
const clinicianPatientRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for all demo data
clinicianPatientRouter.get('/', isAuthenticated, hasRole('clinician'), patientController.getAllPatients)

// add a route to handle the GET request for one data instance
clinicianPatientRouter.get('/:id/clinician_patient_data/', isAuthenticated, hasRole('clinician'), patientController.getPatientHealthDataById)
clinicianPatientRouter.get('/:id/clinician_patient_support_messages/', isAuthenticated, hasRole('clinician'), patientController.getPatientSupportMessagesById)
clinicianPatientRouter.get('/:id/clinician_patient_notes/', isAuthenticated, hasRole('clinician'), patientController.getPatientClinicalNotesById)
clinicianPatientRouter.get('/:id/clinician_patient_profile/', isAuthenticated, hasRole('clinician'), patientController.getPatientProfileById)

// add a new JSON object to the database
clinicianPatientRouter.post('/insertPatient', isAuthenticated, hasRole('clinician'), patientController.insertPatient)

// add a new JSON object to the database
clinicianPatientRouter.post('/updateSettings/:id', isAuthenticated, hasRole('clinician'), patientController.updateSettings)


// export the router
module.exports = clinicianPatientRouter