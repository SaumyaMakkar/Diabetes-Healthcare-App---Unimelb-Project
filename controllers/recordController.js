const Patient = require('../models/patients')
const Record = require('../models/records')
const { io } = require("socket.io-client");
var format = require('date-fns/format')

var socket = io("ws://localhost:3000");

const insertRecord = async (req, res) => {
    console.log("insertRecord");

    // Patient Pat's ID
    const clientId = "6266b28279efed36161bf58a";

    try {
        const patient = await Patient.findById(clientId).lean()

        const { healthType, value, comment } = req.body;
        const today = format(new Date(), 'dd/MM/yyyy');

        // find latest healthDataSettings
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;

        // check if value entered is out of threshold and update accordingly
        let outOfTheThreshold = false;
        if (healthDataSettings[healthType].mandatory) {
            if ((parseInt(value) < healthDataSettings[healthType].lowerThreshold) || (value > healthDataSettings[healthType].upperThreshold)) {
                console.log(healthType, ": ", healthDataSettings[healthType].lowerThreshold, "-", healthDataSettings[healthType].upperThreshold)
                console.log("value entered is out of threshold")
                outOfTheThreshold = true;
            }
        }

        // find current record for today and update it
        const record = await Records.findOne({ patientId: clientId, date: today });

        record[healthType].value = value;
        record[healthType].comment = comment;
        record[healthType].outOfTheThreshold = outOfTheThreshold;
        record[healthType].timestamp = new Date();

        await record.save();
        if (outOfTheThreshold) {
            console.log("insertRecord ---------------------------------------------------")
            console.log(socket)
            await socket.emit('notification', { msg: patient.givenName + " entered a data out of the Threshold" });
            //socket.disconnect()
        }


        res.redirect('/patient_home')
    } catch (err) {
        console.log(err)
        return res.json({ result: false, msg: err })
    }
}


module.exports = {
    insertRecord
}