const Record = require('../models/records')

const insertRecord = async (req, res, next) => {
    /* Kaydee */

    console.log("insertRecord")
    
    const { glucoseLevel, glucoseLevelComment, weight, weightComment, insulinDoses, insulinDosesComment, exercise, exerciseComment } = req.body;

    /* get patient ID and get the respective thresholds */

    try {
        const newRecord = await Record.create({
            patientId: "624fc3977815c23276639393",
            date: new Date(),
            glucoseLevel: {
                value: glucoseLevel,
                comment: glucoseLevelComment,
                outOfTheThreshold: Boolean,
                timestamp: new Date.now()
            },
            weight: {
                value: weight,
                comment: weightComment,
                outOfTheThreshold: Boolean,
                timestamp: new Date.now()
            },
            insulineDoses: {
                value: insulinDoses,
                comment: insulinDosesComment,
                outOfTheThreshold: Boolean,
                timestamp: new Date.now()
            },
            exercise: {
                value: exercise,
                comment: exerciseComment,
                outOfTheThreshold: Boolean,
                timestamp: new Date.now()
            }
        })
        console.log(newRecord)
        res.redirect('patient_home')
    } catch (err) {
        return next(err)
    }
}


module.exports = {
    insertRecord
}