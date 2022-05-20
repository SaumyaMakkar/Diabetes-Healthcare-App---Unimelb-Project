const Clinician = require('../models/clinicians')
const Patient = require('../models/patients')
const Records = require('../models/records')
const Users = require('../models/users')
var format = require('date-fns/format')
var { format, differenceInDays } = require('date-fns')

const getClinicianInfo = async (req, res, next) => {
    console.log("getClinicianInfo");
    let clinicianId = req.user.referenceId;
    try {
        const clinician = await Clinician.findById(clinicianId).lean()
        if (!clinician) {
            // no clinician found in database
            return res.sendStatus(404)
        }
        // found clinician
        console.log("clinician");
        console.log(clinician);

        return res.render('clinician_profile', { clinician: clinician })
    } catch (err) {
        return next(err)
    }
}

const updateClinicianProfile = async (req, res, next) => {
    let clinicianId = req.user.referenceId;
    try {
        const clinician = await Clinician.findById(
            clinicianId
        ).lean();

        // clinician not found

        if (!clinician) {
            return res.sendStatus(404);
        }

        // clinician found
        const updatedData = await Clinician.findByIdAndUpdate(
            clinicianId,
            req.body
        ).lean();


        res.redirect('/clinician_profile');
    } catch (error) { }
};

const getAllPatients = async (req, res, next) => {
    console.log("getAllPatients");
    let clinicianId = req.user.referenceId;
    try {
        const patients = await Patient.find({ clinicianId: clinicianId }).lean();
        const newPatientsArray = [];

        for (let index = 0; index < patients.length; index++) {
            const patient = patients[index];
            console.log("patient");
            console.log(patient);

            const today = format(new Date(), 'dd/MM/yyyy');

            // find latest healthDataSettings
            let lastPosition = patient.requiredRecordsHistory.length - 1;
            const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

            // find the last record for today if not create one
            let lastRecord = await Records.findOne({ patientId: patient._id, date: today }).sort({ date: -1 }).lean()
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

        // find engagement rate
        const today = new Date();
        const createdDate = patient.createdDate;
        const nOfDays = differenceInDays(today, createdDate) + 1;

        console.log("Today")
        console.log(today)
        console.log("created date")
        console.log(createdDate)
        console.log("raw difference")
        console.log(differenceInDays(today, createdDate))
        console.log("personal details")
        console.log(patient.givenName)
        console.log("records/healthData")
        console.log(healthData.length)
        let numberOfRegisteredRecords = 0;

        for (let j = 0; j < healthData.length; j++) {
            const element = healthData[j];
            let flag = false;
            if (element.glucoseLevel.value != 0) {
                flag = true;
            }
            if (element.weight.value != 0) {
                flag = true;
            }
            if (element.insulinDoses.value != 0) {
                flag = true;
            }
            if (element.exercise.value != 0) {
                flag = true;
            }
            if (flag) {
                numberOfRegisteredRecords++;
            }
        }
        const engagementRate = parseInt((numberOfRegisteredRecords * 100) / nOfDays);

        console.log("engagementRate calculation")
        console.log(numberOfRegisteredRecords + " * 100 /" + nOfDays + " = " + engagementRate)

        return res.render('clinician_patient_data', {
            patient: patient,
            engagementRate: engagementRate,
            healthDataSettings: healthDataSettings,
            healthData: healthData
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
    console.log("getAllPatientsComments");
    // return res.render('clinician_patients_comments');

    let clinicianId = req.user.referenceId;
    try {
        const patients = await Patient.find({ clinicianId: clinicianId }).lean();
        const newPatientsArray = [];

        for (let index = 0; index < patients.length; index++) {
            const patient = patients[index];
            console.log("patient");
            console.log(patient);

            const today = format(new Date(), 'dd/MM/yyyy');

            // find latest healthDataSettings
            let lastPosition = patient.requiredRecordsHistory.length - 1;
            const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

            // find the last record for today if not create one
            let lastRecord = await Records.findOne({ patientId: patient._id, date: today }).sort({ date: -1 }).lean()
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

        return res.render('clinician_patients_comments', {
            todayDate: new Date(),
            patients: newPatientsArray
        })
    } catch (err) {
        return next(err)
    }
}


const insertPatient = async (req, res, next) => {
    console.log("insertPatient");
    let clinicianId = req.user.referenceId;
    try {
        // get details from form
        const { email, password, urlImage, givenName, familyName, screenName, yearOfBirth, bio } = req.body;
        const randomPos = Math.floor(Math.random() * 3);
        const demoImages = ["https://cdn-icons-png.flaticon.com/512/921/921026.png?w=1060", "https://cdn-icons-png.flaticon.com/512/3048/3048122.png", "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"]
        // create new patient
        const newPatient = await Patient.create({
            email: email,
            urlImage: urlImage ? urlImage : demoImages[randomPos],
            givenName: givenName,
            familyName: familyName,
            screenName: screenName,
            yearOfBirth: yearOfBirth,
            bio: bio,
            clinicianId: clinicianId,    // hard-coded clinician ID for now
            requiredRecordsHistory: [{
                fromDate: new Date(),
                records: {
                    glucoseLevel: {
                        upperThreshold: 7,
                        lowerThreshold: 4,
                        mandatory: true
                    },
                    weight: {
                        upperThreshold: 90,
                        lowerThreshold: 40,
                        mandatory: true
                    },
                    insulinDoses: {
                        upperThreshold: 10,
                        lowerThreshold: 4,
                        mandatory: true
                    },
                    exercise: {
                        upperThreshold: 10000,
                        lowerThreshold: 8000,
                        mandatory: true
                    }
                }
            }],
            supportMessages: [],
            notes: []
        })

        const result = Users.create({
            username: email,
            password: password,
            role: "patient",
            colors: {
                themeName: "default",
                primaryColor: "#4AA68B",
                backgroundColor: "#13678A"
            },
            referenceId: newPatient._id
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
module.exports = {
    getPatientHealthDataById,
    getPatientSupportMessagesById,
    getPatientClinicalNotesById,
    getPatientProfileById,
    getAllPatientsComments,
    insertPatient,
    updateSettings,
    insertSupportMessage,
    insertClinicalNote,
    getClinicianInfo,
    updateClinicianProfile,
    getAllPatients
}