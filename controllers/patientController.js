const Patient = require('../models/patients')
const Records = require('../models/records')
const mongoose = require('mongoose')

const getAllPatients = async (req, res, next) => {
    // Mia

    /* You can use use the function getPatientHealthDataById as a reference */

    console.log("getAllPatients")
    try {
        const patients = await Patient.find(req.params.patient).populate({ path: 'record_patient', model: 'records' }).lean();
        // const healthData = await Records.find({ patientId: req.params.id }).sort({ date: -1 }).lean()

        if (!patients) {
            // no patient found in database
            return res.sendStatus(404)
        }


        console.log("patients")
        console.log(patients)
        // return res.render('clinician_patients_comments', { patients: patients })
        // console.log(patients[0].record_patient);
        return res.render('clinician_dashboard', { patients: patients })
    } catch (err) {
        return next(err)
    }
}

const getPatientDashboard = async (req, res, next) => {
    /* Tristan */

    /* You can use use the function getPatientHealthDataById as a reference */
    try {
        const patient = await Patient.findById("624fc3977815c23276639393").lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        // Finding the records of the patient
        const healthData = await Records.find({ patientId: "624fc3977815c23276639393" }).sort({date: -1}).lean() 
        
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        // found patient
        return res.render('patient_home', {
            patient: patient,
            healthDataSettings: healthDataSettings,
            healthData: healthData
        })
    } catch (err) {
        return next(err)
    }
    //console.log("getPatientDashboard")
    //return res.render('patient_home')
}

const getPatientHealthDataById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id).lean()
        if (!patient) {
            // no patient found in database
            // console.log("No patients");
            return res.sendStatus(404)
        }
        console.log("Healthid");
        console.log(patient);
        // Finding the records of the patient
        const healthData = await Records.find({ patientId: req.params.id }).sort({ date: -1 }).lean()

        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        console.log("healthData");
        console.log(healthData);
        // found patient
        return res.render('clinician_patient_data', {
            patient: patient,
            healthDataSettings: healthDataSettings,
            healthData: healthData
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientSupportMessagesById = async (req, res, next) => {
    return res.render('clinician_patient_support_messages');
}

const getPatientClinicalNotesById = async (req, res, next) => {
    return res.render('clinician_patient_notes');
}

const getPatientProfileById = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id).lean()
        if (!patient) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('clinician_patient_profile', { patient: patient })
    } catch (err) {
        return next(err)
    }
}
const getAllPatientsComments = async (req, res, next) => {
    return res.render('clinician_patients_comments');
}


const insertPatient = async (req, res, next) => {

    const { givenName, familyName, email, screenName, yearOfBirth, bio } = req.body;
    try {
        const newPatient = await Patient.create({
            email: email,
            givenName: givenName,
            familyName: familyName,
            screenName: screenName,
            yearOfBirth: yearOfBirth,
            bio: bio,
            clinicianId: "6261e9d38bc788f1c0aaa43e",
            requiredRecordsHistory: [
                {
                    fromDate: new Date(),
                    records: {
                        glucoseLevel: {
                            upperThreshold: 0,
                            lowerThreshold: 0,
                            mandatory: false
                        },
                        weight: {
                            upperThreshold: 0,
                            lowerThreshold: 0,
                            mandatory: false
                        },
                        insulineDoses: {
                            upperThreshold: 0,
                            lowerThreshold: 0,
                            mandatory: false
                        },
                        exercise: {
                            upperThreshold: 0,
                            lowerThreshold: 0,
                            mandatory: false
                        }
                    }
                }
            ],
            supportMessages: [],
            notes: [],
            urlImage: "https://image"
        })
        console.log(newPatient)
        res.redirect('/clinician_dashboard')
    } catch (err) {
        return next(err)
    }
}

const updateSettings = async (req, res, next) => {

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        const { glucoseLevel_check, glucoseLevel_lowerThreshold, glucoseLevel_upperThreshold } = req.body;
        const { weight_check, weight_lowerThreshold, weight_upperThreshold } = req.body;
        const { insulineDoses_check, insulineDoses_lowerThreshold, insulineDoses_upperThreshold } = req.body;
        const { exercise_check, exercise_lowerThreshold, exercise_upperThreshold } = req.body;

        console.log(req.body)
        let mandatory_glucoseLevel = false;
        if (glucoseLevel_check == "on") {
            mandatory_glucoseLevel = true;
        }
        let mandatory_weight = false;
        if (weight_check == "on") {
            mandatory_weight = true;
        }
        let mandatory_insulineDoses = false;
        if (insulineDoses_check == "on") {
            mandatory_insulineDoses = true;
        }
        let mandatory_exercise = false;
        if (exercise_check == "on") {
            mandatory_exercise = true;
        }
        const newRecordsHistory = {
            fromDate: new Date(),
            records: {
                glucoseLevel: {
                    upperThreshold: glucoseLevel_upperThreshold,
                    lowerThreshold: glucoseLevel_lowerThreshold,
                    mandatory: mandatory_glucoseLevel
                },
                weight: {
                    upperThreshold: weight_upperThreshold,
                    lowerThreshold: weight_lowerThreshold,
                    mandatory: mandatory_weight
                },
                insulineDoses: {
                    upperThreshold: insulineDoses_upperThreshold,
                    lowerThreshold: insulineDoses_lowerThreshold,
                    mandatory: mandatory_insulineDoses
                },
                exercise: {
                    upperThreshold: exercise_upperThreshold,
                    lowerThreshold: exercise_lowerThreshold,
                    mandatory: mandatory_exercise
                }
            }
        }

        // in this line we are appeding the newRecordsHistory to the actual list of requiredRecordsHistory
        patient.requiredRecordsHistory = [...patient.requiredRecordsHistory, newRecordsHistory];
        await patient.save();
        res.redirect('/clinician_dashboard/' + req.params.id + '/clinician_patient_data')
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getAllPatients,
    getPatientDashboard,
    getPatientHealthDataById,
    getPatientSupportMessagesById,
    getPatientClinicalNotesById,
    getPatientProfileById,
    getAllPatientsComments,
    insertPatient,
    updateSettings
}