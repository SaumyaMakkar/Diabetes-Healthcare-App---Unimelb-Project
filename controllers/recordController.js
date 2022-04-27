const Record = require('../models/records')

const insertRecord = async (req, res, next) => {
    /* Kaydee */
    
    const { glucoseLevel, glucoseLevelComment, weight, weightComment, insulinDoses, insulinDosesComment, exercise, exerciseComment } = req.body;

    /* get patient ID and get the respective thresholds to check later on */
    const patient = await Patient.findById("6268d77ad45f7f7784f980b4").lean()
    if (!patient) {
        // no patient found in database
        return res.sendStatus(404)
    }

    let lastPosition = patient.requiredRecordsHistory.length - 1;
    const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

    // TODO: Comparing thresholds
    glucoseLevelOut = false;
    weightOut = false;
    insulinDosesOut = false;
    exerciseOut = false;
    if (glucoseLevel && healthDataSettings.glucoseLevel.mandatory) {
        if ((glucoseLevel < healthDataSettings.glucoseLevel.lowerThreshold) || (glucoseLevel < healthDataSettings.glucoseLevel.lowerThreshold)) {
            glucoseLevelOut = true;
        }
    }
    if (weight && healthDataSettings.weight.mandatory) {
        if ((weight < healthDataSettings.weight.lowerThreshold) || (weight < healthDataSettings.weight.lowerThreshold)) {
            weightOut = true;
        }
    }
    if (insulinDoses && healthDataSettings.insulineDoses.mandatory) {
        if ((insulinDoses < healthDataSettings.insulineDoses.lowerThreshold) || (insulinDoses < healthDataSettings.insulineDoses.lowerThreshold)) {
            insulinDosesOut = true;
        }
    }
    if (exercise && healthDataSettings.exercise.mandatory) {
        if ((exercise < healthDataSettings.exercise.lowerThreshold) || (exercise < healthDataSettings.exercise.lowerThreshold)) {
            exerciseOut = true;
        }
    }
    

    try {
        const newRecord = await Record.create({
            patientId: "6268d77ad45f7f7784f980b4",
            date: new Date(),
            glucoseLevel: {
                value: glucoseLevel,
                comment: glucoseLevelComment,
                outOfTheThreshold: glucoseLevelOut,
                timestamp: new Date.now()
            },
            weight: {
                value: weight,
                comment: weightComment,
                outOfTheThreshold: weightOut,
                timestamp: new Date.now()
            },
            insulineDoses: {
                value: insulinDoses,
                comment: insulinDosesComment,
                outOfTheThreshold: insulinDosesOut,
                timestamp: new Date.now()
            },
            exercise: {
                value: exercise,
                comment: exerciseComment,
                outOfTheThreshold: exerciseOut,
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