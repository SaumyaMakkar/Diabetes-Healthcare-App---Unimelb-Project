const express = require('express')

// create our Router object
const clinicianPatientRouter = express.Router()

// require our controller
const patientController = require('../controllers/patientController')

// add a route to handle the GET request for all demo data
clinicianPatientRouter.get('/', patientController.getAllPatients)

// add a route to handle the GET request for one data instance
clinicianPatientRouter.get('/:id/clinician_patient_data/', patientController.getPatientHealthDataById)
clinicianPatientRouter.get('/:id/clinician_patient_support_messages/', patientController.getPatientSupportMessagesById)
clinicianPatientRouter.get('/:id/clinician_patient_notes/', patientController.getPatientClinicalNotesById)
clinicianPatientRouter.get('/:id/clinician_patient_profile/', patientController.getPatientProfileById)

// add a new JSON object to the database
clinicianPatientRouter.post('/insertPatient', patientController.insertPatient)

// add a new JSON object to the database
clinicianPatientRouter.post('/updateSettings/:id', patientController.updateSettings)


// export the router
module.exports = clinicianPatientRouter