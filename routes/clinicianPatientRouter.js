const express = require('express')

// create our Router object
const clinicianPatientRouter = express.Router()

// require our controller
const clinicianController = require('../controllers/clinicianController')
const patientController = require('../controllers/patientController')
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware')

// add a route to handle the GET request for all demo data
clinicianPatientRouter.get('/', isAuthenticated, hasRole('clinician'), clinicianController.getAllPatients)

// add a route to handle the GET request for one data instance
clinicianPatientRouter.get('/:id/clinician_patient_data/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientHealthDataById)
clinicianPatientRouter.get('/:id/clinician_patient_support_messages/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientSupportMessagesById)
clinicianPatientRouter.get('/:id/clinician_patient_notes/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientClinicalNotesById)
clinicianPatientRouter.get('/:id/clinician_patient_profile/', isAuthenticated, hasRole('clinician'), clinicianController.getPatientProfileById)

// add a new JSON object to the database

clinicianPatientRouter.post('/insertPatient', isAuthenticated, hasRole('clinician'), clinicianController.insertPatient)

// add a new JSON object to the database
clinicianPatientRouter.post('/updateSettings/:id', isAuthenticated, hasRole('clinician'), clinicianController.updateSettings)

clinicianPatientRouter.post('/insertSupportMessage/:id', clinicianController.insertSupportMessage)
clinicianPatientRouter.post('/insertClinicalNote/:id', clinicianController.insertClinicalNote)



// export the router
module.exports = clinicianPatientRouter