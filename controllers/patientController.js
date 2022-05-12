const Patient = require('../models/patients')
const Records = require('../models/records')
const mongoose = require('mongoose')
var format = require('date-fns/format')

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
        // res.render('clinician_patients_comments', { patients: patients })
        // console.log(patients[0].record_patient);
        return res.render('clinician_dashboard', { patients: patients })
    } catch (err) {
        return next(err);
    }
}

const getPatientDashboard = async (req, res, next) => {
    console.log("getPatientDashboard");

    // Patient Pat's ID
    const patientId = "6266b28279efed36161bf58a";

    try {
        const patient = await Patient.findById(patientId).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        // found patient
        console.log("patient");
        console.log(patient);

        const today = format(new Date(), 'dd/MM/yyyy');

        // find latest healthDataSettings
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        // find the last record for today if not create one
        let lastRecord = await Records.findOne({ patientId: patientId, date: today }).sort({ date: -1 }).lean()
        if (!lastRecord) {
            await Records.create({
                patientId: patientId,
                date: today,
                glucoseLevel: {
                    value: 0,
                    comment: "",
                    outOfTheThreshold: false,
                    mandatory: healthDataSettings.glucoseLevel.mandatory
                },
                weight: {
                    value: 0,
                    comment: "",
                    outOfTheThreshold: false,
                    mandatory: healthDataSettings.weight.mandatory
                },
                insulinDoses: {
                    value: 0,
                    comment: "",
                    outOfTheThreshold: false,
                    mandatory: healthDataSettings.insulinDoses.mandatory
                },
                exercise: {
                    value: 0,
                    comment: "",
                    outOfTheThreshold: false,
                    mandatory: healthDataSettings.exercise.mandatory
                }
            })
        }
        lastRecord = await Records.findOne({ patientId: patientId, date: today }).sort({ date: -1 }).lean()
        console.log("lastRecord");
        console.log(lastRecord);

        return res.render('patient_home', {
            patient: patient,
            healthDataSettings: healthDataSettings,
            lastRecord: lastRecord
        })
    } catch (err) {
        return next(err)
    }
}



//waiting for login passport
const getPatientHealthDataByManualId = async (req, res, next) => {
    console.log("getPatientHealthDataByManualId");

    // Patient Pat's ID
    const patientId = "6266b28279efed36161bf58a";

    try {
        const patient = await Patient.findById(patientId).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        // found patient
        console.log("patient");
        console.log(patient);

        // find all the records of the patient
        const healthData = await Records.find({ patientId: patientId }).sort({ date: -1 }).lean()
        console.log("healthData");
        console.log(healthData);

        // find latest healthDataSettings
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        return res.render('patient_records', {
            patient: patient,
            healthDataSettings: healthDataSettings,
            healthData: healthData
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientHealthDataById = async (req, res, next) => {
    console.log("getPatientHealthDataById");
    try {
        const patient = await Patient.findById(req.params.id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }
        // found patient
        console.log("patient");
        console.log(patient);

        // find all the records of the patient
        const healthData = await Records.find({ patientId: req.params.id }).sort({ date: -1 }).lean()
        console.log("healthData");
        console.log(healthData);

        // find latest healthDataSettings
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

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
    console.log("getPatientSupportMessagesById");
    try {
        const patient = await Patient.findById(req.params.id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        // find all the support messages of the patient
        const supportMessage = (patient.supportMessages).reverse()
        console.log("supportMessages");
        console.log(supportMessage);

        return res.render('clinician_patient_support_messages', {
            patient: patient,
            supportMessage: supportMessage
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientClinicalNotesById = async (req, res, next) => {
    console.log("getPatientClinicalNotesById");
    try {
        const patient = await Patient.findById(req.params.id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        // find all the clinical notes of the patient
        const clinicalNote = (patient.notes).reverse()
        console.log("clinicalNotes");
        console.log(clinicalNote);

        return res.render('clinician_patient_notes', {
            patient: patient,
            clinicalNote: clinicalNote
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientProfileById = async (req, res, next) => {
    console.log("getPatientProfileById");
    try {
        const patient = await Patient.findById(req.params.id).lean()
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        return res.render('clinician_patient_profile', { patient: patient })
    } catch (err) {
        return next(err)
    }
}
const getAllPatientsComments = async (req, res, next) => {


    // console.log("getAllPatients")
    try {
        const patients = await Patient.find(req.params.patient).populate({ path: 'record_patient', model: 'records' }).lean();

        if (!patients) {
            // no patient found in database
            return res.sendStatus(404)
        }


        console.log("patients")
        console.log(patients)

        return res.render('clinician_patients_comments', { patients: patients });
    } catch (err) {
        return next(err);
    }

}



const insertPatient = async (req, res, next) => {
    console.log("insertPatient");
    try {
        // get details from form
        const { email, urlImage, givenName, familyName, screenName, yearOfBirth, bio } = req.body;

        // create new patient
        const newPatient = await Patient.create({
            email: email,
            urlImage: urlImage,
            givenName: givenName,
            familyName: familyName,
            screenName: screenName,
            yearOfBirth: yearOfBirth,
            bio: bio,
            clinicianId: "6261e9d38bc788f1c0aaa43e",    // hard-coded clinician ID for now
            requiredRecordsHistory: [{
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
                    insulinDoses: {
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
            }],
            supportMessages: [],
            notes: []
        })
        console.log(newPatient);

        res.redirect('/clinician_dashboard')
    } catch (err) {
        return next(err)
    }
}

const updateSettings = async (req, res, next) => {
    console.log("updateSettings");
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        // get details from form
        const { glucoseLevel_check, glucoseLevel_lowerThreshold, glucoseLevel_upperThreshold } = req.body;
        const { weight_check, weight_lowerThreshold, weight_upperThreshold } = req.body;
        const { insulinDoses_check, insulinDoses_lowerThreshold, insulinDoses_upperThreshold } = req.body;
        const { exercise_check, exercise_lowerThreshold, exercise_upperThreshold } = req.body;

        // find the record for today
        const today = format(new Date(), 'dd/MM/yyyy');
        const todayRecord = await Records.findOne({ patientId: req.params.id, date: today }).sort({ date: -1 })
        console.log("todayRecord")
        console.log(todayRecord)

        // update the checker for each health data
        let mandatory_glucoseLevel = false;
        if (glucoseLevel_check == "on") {
            mandatory_glucoseLevel = true;
        }
        let mandatory_weight = false;
        if (weight_check == "on") {
            mandatory_weight = true;
        }
        let mandatory_insulinDoses = false;
        if (insulinDoses_check == "on") {
            mandatory_insulinDoses = true;
        }
        let mandatory_exercise = false;
        if (exercise_check == "on") {
            mandatory_exercise = true;
        }

        // create newRecordsHistory record
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
                insulinDoses: {
                    upperThreshold: insulinDoses_upperThreshold,
                    lowerThreshold: insulinDoses_lowerThreshold,
                    mandatory: mandatory_insulinDoses
                },
                exercise: {
                    upperThreshold: exercise_upperThreshold,
                    lowerThreshold: exercise_lowerThreshold,
                    mandatory: mandatory_exercise
                }
            }
        }

        // append the newRecordsHistory to the actual list of requiredRecordsHistory
        patient.requiredRecordsHistory = [...patient.requiredRecordsHistory, newRecordsHistory];
        await patient.save();

        // find latest healthDataSettings
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        // update the current values
        if (todayRecord) {

            todayRecord.glucoseLevel.mandatory = mandatory_glucoseLevel;
            todayRecord.weight.mandatory = mandatory_weight;
            todayRecord.insulinDoses.mandatory = mandatory_insulinDoses;
            todayRecord.exercise.mandatory = mandatory_exercise;

            const healthDataTypes = ["glucoseLevel", "weight", "insulinDoses", "exercise",]
            for (let index = 0; index < healthDataTypes.length; index++) {
                const healthType = healthDataTypes[index];
                if (parseInt(todayRecord[healthType].value) != 0) {
                    console.log("todayRecord[healthType].value")
                    console.log(todayRecord[healthType].value, "< ", healthDataSettings[healthType].lowerThreshold, " ", healthDataSettings[healthType].upperThreshold)
                    if ((parseInt(todayRecord[healthType].value) < healthDataSettings[healthType].lowerThreshold) || (todayRecord[healthType].value > healthDataSettings[healthType].upperThreshold)) {
                        todayRecord[healthType].outOfTheThreshold = true;
                        console.log("yes")
                    } else {
                        todayRecord[healthType].outOfTheThreshold = false;
                    }
                }
            }

            await todayRecord.save();
        }

        res.redirect('/clinician_dashboard/' + req.params.id + '/clinician_patient_data')
    } catch (err) {
        return next(err)
    }
}

const insertSupportMessage = async (req, res, next) => {
    console.log("insertSupportMessage");
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        // get details from form
        const { message } = req.body;

        // create new support message record
        const newSupportMessage = { message: message }

        // append newSupportMessage to the actual list of supportMessages
        patient.supportMessages = [...patient.supportMessages, newSupportMessage];
        await patient.save();

        res.redirect('/clinician_dashboard/' + req.params.id + '/clinician_patient_support_messages')
    } catch (err) {
        return next(err)
    }
}

const insertClinicalNote = async (req, res, next) => {
    console.log("insertClinicalNote");
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        // get details from form 
        const { message } = req.body;

        // create new clinical note record
        const newClinicalNote = { message: message }

        // append newClinicalNote to the actual list of notes
        patient.notes = [...patient.notes, newClinicalNote];
        await patient.save();

        res.redirect('/clinician_dashboard/' + req.params.id + '/clinician_patient_notes')
    } catch (err) {
        return next(err)
    }
}


module.exports = {
    getPatientDashboard,
    getAllPatients,
    getPatientHealthDataByManualId,
    getPatientHealthDataById,
    getPatientSupportMessagesById,
    getPatientClinicalNotesById,
    getPatientProfileById,
    getAllPatientsComments,
    insertPatient,
    updateSettings,
    insertSupportMessage,
    insertClinicalNote
}