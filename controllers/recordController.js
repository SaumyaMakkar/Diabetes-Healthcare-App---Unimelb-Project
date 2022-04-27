const Patient = require('../models/patients')
const Record = require('../models/records')

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