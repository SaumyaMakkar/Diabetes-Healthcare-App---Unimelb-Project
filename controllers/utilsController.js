const Patient = require('../models/patients')
const Records = require('../models/records')
const { format, subDays, addDays } = require('date-fns')
const getGraphData = async (req, res, next) => {

    console.log("getGraphData")
    const patientId = req.user.referenceId;

    const patient = await Patient.findById(patientId).lean()
    if (!patient) {
        return res.sendStatus(404)
    }
    const toDate = new Date();
    let fromDate = subDays(toDate, 7);
    console.log(fromDate, toDate);
    /* switch (selectedRange) {
        case "LastWeek":
            fromDate = previousMonday(toDate);
            break;
        case "LastMonth":
            fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 01);
            break;
        case "LastYear":
            fromDate = new Date(toDate.getFullYear(), 0, 1);
            break;
        default:
            //fromDate = previousMonday(toDate);
            fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 01);
            break;
    } */


    // Finding the records of the patient
    const healthDataRecords = await Records.find({ patientId: patientId }).sort({ date: 1 }).lean()
    const filteredRecords = []
    /* Filtering data */
    for (let index = 0; index < healthDataRecords.length; index++) {
        const element = healthDataRecords[index];
        var newData = element.date.replace(/(\d+[/])(\d+[/])/, '$2$1');
        var currentDate = new Date(newData);
        if (fromDate <= currentDate && currentDate <= toDate) {
            console.log(element.date)
            filteredRecords.push(element)
        }
    }
    console.log("Creating chart ")
    /* Creating chart */
    const labels = [];
    const glucoseLevelRecords = [];
    const weightRecords = [];
    const insulinDosesRecords = [];
    const exerciseRecords = [];
    let pivotDate = addDays(fromDate, 1);
    let filteredPivot = 0;
    for (let index = 0; index < 7; index++) {
        const element = filteredRecords[filteredPivot];
        //console.log("element")
        //console.log(element)
        if (element) {
            var newData = element.date.replace(/(\d+[/])(\d+[/])/, '$2$1');
            var currentDate = new Date(newData);
            console.log(format(pivotDate, "dd/MM/yyyy") + " == " + format(currentDate, "dd/MM/yyyy"))
            if (format(pivotDate, "dd/MM/yyyy") == format(currentDate, "dd/MM/yyyy")) {
                glucoseLevelRecords.push(element.glucoseLevel.value)
                weightRecords.push(element.weight.value)
                insulinDosesRecords.push(element.insulinDoses.value)
                exerciseRecords.push(element.exercise.value)
                /* glucoseLevelRecords.push(element.date + "-")
                weightRecords.push(element.date + "-")
                insulinDosesRecords.push(element.date + "-")
                exerciseRecords.push(element.date + "-") */
                filteredPivot++;
            } else {
                glucoseLevelRecords.push(0)
                weightRecords.push(0)
                insulinDosesRecords.push(0)
                exerciseRecords.push(0)
            }
        } else {
            glucoseLevelRecords.push(0)
            weightRecords.push(0)
            insulinDosesRecords.push(0)
            exerciseRecords.push(0)
        }
        let pivotDateName = format(pivotDate, 'EEEE dd')
        if (format(pivotDate, "dd/MM/yyyy") == format(toDate, "dd/MM/yyyy")) {
            labels.push("Today "+format(toDate, "dd"));
        } else {
            labels.push(pivotDateName);
        }
        pivotDate = addDays(pivotDate, 1);
    }

    console.log("labels");
    console.log(labels);
    res.json({
        labels: labels,
        glucoseLevelRecords: glucoseLevelRecords,
        weightRecords: weightRecords,
        insulinDosesRecords: insulinDosesRecords,
        exerciseRecords: exerciseRecords,
    });

}


module.exports = { getGraphData }