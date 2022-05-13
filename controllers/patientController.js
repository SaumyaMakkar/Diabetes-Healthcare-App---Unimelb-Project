const Patient = require('../models/patients')
const Records = require('../models/records')
const mongoose = require('mongoose')
var { format, differenceInDays } = require('date-fns')

const getPatientDashboard = async (req, res, next) => {
    console.log("getPatientDashboard");

    // Patient Pat's ID
    const patientId = req.user.referenceId;

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
            lastRecord: lastRecord,
            colors: req.user.colors,
            themeName: req.user.colors.themeName
        })
    } catch (err) {
        return next(err)
    }
}


const getPatientHealthDataByUserId = async (req, res, next) => {
    console.log("getPatientHealthDataByUserId");

    // Patient Pat's ID
    const patientId = req.user.referenceId;

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
            healthData: healthData,
            colors: req.user.colors,
            themeName: req.user.colors.themeName
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientProfile = async (req, res, next) => {
    const patientId = req.user.referenceId;
    console.log("getPatientProfile")
    try {
        const patient = await Patient.findById(patientId).lean()
        if (!patient) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found person
        console.log(req.user.colors)
        return res.render('patient_account', {
            patient: patient,
            colors: req.user.colors,
            themeName: req.user.colors.themeName
        })
    } catch (err) {
        return next(err)
    }
}

const getPatientLeaderboard = async (req, res, next) => {
    const patientId = req.user.referenceId;
    console.log("getPatientsLeaderboard")
    const today = new Date();

    try {
        let patients = await Patient.find()
        const patientsEngagement = []
        let userEngagementRate = 0;
        for (let i = 0; i < patients.length; i++) {

            const patient = patients[i];
            const createdDate = patient.createdDate;
            const nOfDays = differenceInDays(today, createdDate);

            let records = await Records.find({ patientId: patient._id }).sort({ date: -1 }).lean()

            console.log("personal details")
            console.log(patient.givenName)
            console.log("records")
            console.log(records.length)
            let numberOfRegisteredRecords = 0;

            for (let j = 0; j < records.length; j++) {
                const element = records[j];
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

            console.log("nOfDays")
            console.log(numberOfRegisteredRecords + " * 100 /" + nOfDays + " = " + engagementRate)
            if (patient._id == patientId) {
                userEngagementRate = engagementRate
            }
            patientsEngagement.push(
                {
                    urlImage: patient.urlImage,
                    screenName: patient.screenName,
                    engagementRate: engagementRate
                }
            )
        }

        patientsEngagement.sort(GetSortOrder("engagementRate"));
        let finalPatientList = []
        for (let index = 0; index < patientsEngagement.length; index++) {
            if (index < 5) {
                finalPatientList.push({
                    ...patientsEngagement[index],
                    order: index + 1
                })
            }

        }

        return res.render("patient_leaderboard",
            {
                colors: req.user.colors,
                themeName: req.user.colors.themeName,
                engagementRate: userEngagementRate,
                patients: finalPatientList
            });
    } catch (err) {
        return next(err)
    }


}


const updatePatientDetails = async (req, res, next) => {

    console.log("updatePatientDetails")
    const clientId = req.user.referenceId;

    console.log(req.user)
    try {
        const { givenName, familyName, screenName, yearOfBirth, bio } = req.body;

        const patient = await Patient.findById(clientId);
        console.log(patient)
        if (!patient) {
            return res.json({
                result: false,
                msg:"not found"
            })
        }

        patient.givenName = givenName;
        patient.familyName = familyName;
        patient.screenName = screenName;
        patient.yearOfBirth = yearOfBirth;
        patient.bio = bio;

        await patient.save();
        return res.json({
            result: true,
            msg: "Personal details updated"
        })


    } catch (err) {
        console.log(err)
        return res.json({ result: false, msg: err })
    }
}

//Comparer Function    
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;
        }
        return 0;
    }
}

module.exports = {
    getPatientDashboard,
    getPatientHealthDataByUserId,
    getPatientLeaderboard,
    getPatientProfile,
    updatePatientDetails
}