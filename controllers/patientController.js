const Patient = require('../models/patients')
const Records = require('../models/records')
const mongoose = require('mongoose')
var format = require('date-fns/format')

const getAllPatients = async (req, res, next) => {

    console.log("getAllPatients")
    try {
        const patients = await Patient.find({ clinicianId: "6261e9d38bc788f1c0aaa43e" }).lean();
        const newPatientsArray = [];

        for (let index = 0; index < patients.length; index++) {
            const patient = patients[index];

            console.log("patient")
            console.log(patient)
            const today = format(new Date(), 'dd/MM/yyyy');
            console.log("today", today)
            let lastRecord = await Records.findOne({ patientId: patient._id, date: today }).sort({ date: -1 }).lean()

            let lastPosition = patient.requiredRecordsHistory.length - 1;
            const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

            if (!lastRecord) {
                lastRecord = {
                    patientId: patient._id,
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
                }
            }

            newPatientsArray.push({
                patientData: patient,
                healthData: lastRecord,
                healthDataSettings: healthDataSettings
            })
        }

        return res.render('clinician_dashboard', {
            todayDate: new Date(),
            patients: newPatientsArray
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientDashboard = async (req, res, next) => {
    console.log("getPatientDashboard")

    const today = format(new Date(), 'dd/MM/yyyy');
    const patientId = "6266b28279efed36161bf58a";
    try {
        const patient = await Patient.findById(patientId).lean()
        console.log(patient);
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;
        // Finding the last record
        let lastRecord = await Records.findOne({ patientId: patientId, date: today }).sort({ date: -1 }).lean()

        console.log("lastRecord");
        console.log(lastRecord);
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
        console.log("lastRecord")
        console.log(lastRecord)
        // found patient
        return res.render('patient_home', {
            patient: patient,
            healthDataSettings: healthDataSettings,
            lastRecord: lastRecord
        })
    } catch (err) {
        return next(err)
    }
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
            urlImage: "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
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

    const today = format(new Date(), 'dd/MM/yyyy');
    const clientId = req.params.id
    try {
        const patient = await Patient.findById(clientId);
        if (!patient) {
            // no patient found in database
            return res.sendStatus(404)
        }

        const { glucoseLevel_check, glucoseLevel_lowerThreshold, glucoseLevel_upperThreshold } = req.body;
        const { weight_check, weight_lowerThreshold, weight_upperThreshold } = req.body;
        const { insulinDoses_check, insulinDoses_lowerThreshold, insulinDoses_upperThreshold } = req.body;
        const { exercise_check, exercise_lowerThreshold, exercise_upperThreshold } = req.body;


        const todayRecord = await Records.findOne({ patientId: clientId, date: today }).sort({ date: -1 })

        console.log("todayRecord")
        console.log(todayRecord)
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

        // in this line we are appeding the newRecordsHistory to the actual list of requiredRecordsHistory
        patient.requiredRecordsHistory = [...patient.requiredRecordsHistory, newRecordsHistory];
        await patient.save();

        // updating the current values
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;
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

            /* console.log("todayRecord")
            console.log(todayRecord) */

            await todayRecord.save();
        }
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