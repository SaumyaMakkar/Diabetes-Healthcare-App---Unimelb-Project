const Patient = require('../models/patients')
const Record = require('../models/records')
const { io } = require("socket.io-client");
var format = require('date-fns/format')

var socket = io("ws://localhost:3000");

const insertRecord = async (req, res) => {

    const clientId = "6266b28279efed36161bf58a";

    try {
        const { healthType, value, comment } = req.body;

        const patient = await Patient.findById(clientId).lean()

        const today = format(new Date(), 'dd/MM/yyyy');
        let outOfTheThreshold = false;
        let lastPosition = patient.requiredRecordsHistory.length - 1;
        const healthDataSettings = patient.requiredRecordsHistory[lastPosition].records;


        if (healthDataSettings[healthType].mandatory) {
            if ((parseInt(value) < healthDataSettings[healthType].lowerThreshold) || (value > healthDataSettings[healthType].upperThreshold)) {
                console.log("out of insulinDoses.mandatory")
                outOfTheThreshold = true;
            }
        }


        const record = await Record.findOne({ patientId: clientId, date: today });

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