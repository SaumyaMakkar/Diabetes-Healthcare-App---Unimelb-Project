const Patient = require('../models/patients')
const Records = require('../models/records')
var format = require('date-fns/format')

// const insertRecord = async (req, res) => {
//     console.log("insertRecord");

//     // Patient Pat's ID
//     const clientId = "6266b28279efed36161bf58a";

//     try {
//         const patient = await Patient.findById(clientId).lean()

//         const { healthType, value, comment } = req.body;
//         const today = format(new Date(), 'dd/MM/yyyy');

//         // find latest healthDataSettings
//         let lastPosition = patient.requiredRecordsHistory.length - 1;
//         const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

//         // check if value entered is out of threshold and update accordingly
//         let outOfTheThreshold = false;
//         if (healthDataSettings[healthType].mandatory) {
//             if ((parseInt(value) < healthDataSettings[healthType].lowerThreshold) || (value > healthDataSettings[healthType].upperThreshold)) {
//                 console.log(healthType, ": ", healthDataSettings[healthType].lowerThreshold, "-", healthDataSettings[healthType].upperThreshold)
//                 console.log("value entered is out of threshold")
//                 outOfTheThreshold = true;
//             }
//         }

//         // find current record for today and update it
//         const record = await Records.findOne({ patientId: clientId, date: today });

//         record[healthType].value = value;
//         record[healthType].comment = comment;
//         record[healthType].outOfTheThreshold = outOfTheThreshold;
//         record[healthType].timestamp = new Date();

//         await record.save();

//         res.redirect('/patient_home')
//     } catch (err) {
//         console.log(err)
//         return res.json({ result: false, msg: err })
//     }
// }
const insertRecord = async (req, res, next) => {
    /* Kaydee */

    /* please modify with the values coming from the form in HTML. Look the example patientController > insertPatient, and the modal in clinician_dashboard */
    console.log("insertRecord")

    /* Example of insertRecord (hardcoded) */
    const newPatient = await Record.create({
        patientId: "6266b28279efed36161bf58a",
        glucoseLevel: {
            mandatory: true,
            outOfTheThreshold: false,
            value: "7.4",
            comment: "Hello",
        },
        weight: {
            mandatory: true,
            outOfTheThreshold: true,
            value: "80",
            comment: "I'm heavy!",
        },
        insulineDoses: {
            mandatory: true,
            outOfTheThreshold: false,
            value: "7.9",
            comment: "",
        },
        exercise: {
            mandatory: false,
            outOfTheThreshold: false,
            value: "",
            comment: "",
        }

    })
    const patient = await Patient.findById("6266b28279efed36161bf58a");
    console.log(patient);

    await patient.record_patient.push(newPatient);
    await patient.save();
    res.redirect('/patient_home')
}



module.exports = {
    insertRecord
}