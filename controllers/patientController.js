const Patient = require('../models/patient')

const getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        console.log("patients");
        console.log(patients);
        return res.render('dashboard', { patients: patients })
    } catch (err) {
        return next(err)
    }
}

const getPatientById = async (req, res, next) => {
    try {
        const author = await Patient.findById(req.params.id).lean()
        if (!author) {
            // no author found in database
            return res.sendStatus(404)
        }
        // found person
        return res.render('oneData', { oneItem: author })
    } catch (err) {
        return next(err)
    }
}

const insertPatient = async (req, res, next) => {
    try {
        const patients = await Patient.find().lean()
        console.log("patients");
        console.log(patients);
        return res.render('dashboard', { patients: patients })
    } catch (err) {
        return next(err)
    }
}


module.exports = {
    getAllPatients,
    getPatientById,
    insertPatient
}