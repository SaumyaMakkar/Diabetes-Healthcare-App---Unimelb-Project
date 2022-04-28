const Patient = require('../models/patients')
const Record = require('../models/records')
var format = require('date-fns/format')

const insertRecord = async (req, res) => {
    /* Kaydee */
    const clientId = "6266b28279efed36161bf58a";
    try {
        console.log("insertRecord")
        const { healthType, glucoseLevel, glucoseLevelComment, weight, weightComment, insulinDosesValue, insulinDosesComment, exercise, exerciseComment } = req.body;
        const today = format(new Date(), 'dd/MM/yyyy');

       // console.log(req)
        console.log("req.body")
        console.log(req.body)
        /* get patient ID and get the respective thresholds to check later on */
        const patient = await Patient.findById(clientId).lean()
        //console.log(patient)

        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        // TODO: Comparing thresholds
        let glucoseLevelOut = false;
        let weightOut = false;
        let insulinDosesOut = false;
        let exerciseOut = false;
        console.log("healthDataSettings")
        console.log(healthDataSettings)
         //For glucoseLevel
         if (healthDataSettings.glucoseLevel.mandatory) {
            if ((parseInt(glucoseLevel) < healthDataSettings.glucoseLevel.lowerThreshold) || (glucoseLevel > healthDataSettings.glucoseLevel.upperThreshold)) {
                console.log("out of insulinDoses.mandatory")
                glucoseLevelOut = true;
            }
        }
        //For insulinDoses
        if (healthDataSettings.insulinDoses.mandatory) {
            if ((parseInt(insulinDosesValue) < healthDataSettings.insulinDoses.lowerThreshold) || (insulinDosesValue > healthDataSettings.insulinDoses.upperThreshold)) {
                console.log("out of insulinDoses.mandatory")
                insulinDosesOut = true;
            }
        }


        const record = await Record.findOne({ patientId: clientId, date: today });
        console.log("today record");
        console.log(record);
        if (glucoseLevel) {
            record.glucoseLevel.value = glucoseLevel;
            record.glucoseLevel.comment = glucoseLevelComment;
            record.glucoseLevel.outOfTheThreshold = glucoseLevelOut;
        }
        if (insulinDosesValue) {
            record.insulinDoses.value = insulinDosesValue;
            record.insulinDoses.comment = insulinDosesComment;
            record.insulinDoses.outOfTheThreshold = insulinDosesOut;
        }

        await record.save();
        /* const newRecord = await Record.create({
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
            insulinDoses: {
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
        }) */
        //console.log(newRecord)
        //res.redirect('patient_home')
        res.redirect('/patient_home')
        //return res.json({ result: true, msg: "Record updated" })
    } catch (err) {
        console.log(err)
        return res.json({ result: false, msg: err })
    }
}


module.exports = {
    insertRecord
}