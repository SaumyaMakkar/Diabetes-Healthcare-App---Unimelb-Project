const Record = require('../models/records')

const insertRecord = async (req, res, next) => {
    /* Kaydee */

    /* please modify with the values coming from the form in HTML. Look the example patientController > insertPatient, and the modal in clinician_dashboard */
    console.log("insertRecord")

    /* Example of insertRecord (hardcoded) */
    const newPatient = await Record.create({
        patientId: "624fc3977815c23276639393",
        glucoseLevel: {
            mandatory: true,
            outOfTheThreshold: false,
            value: "7.4",
            comment: "",
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
            value: "",
            comment: "",
        },
        exercise: {
            mandatory: false,
            outOfTheThreshold: false,
            value: "",
            comment: "",
        }

    })
    res.redirect('/patient_home')
}


module.exports = {
    insertRecord
}