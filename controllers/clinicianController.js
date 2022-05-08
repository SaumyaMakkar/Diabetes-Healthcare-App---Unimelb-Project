const Clinician = require('../models/clinicians')

const getClinicianInfo = async (req, res, next) => {
    console.log("getClinicianInfo");
    try {
        const clinician = await Clinician.findById("6261e9d38bc788f1c0aaa43e").lean()
        if (!clinician) {
            // no clinician found in database
            return res.sendStatus(404)
        }
        // found clinician
        console.log("clinician");
        console.log(clinician);
        
        return res.render('clinician_profile', { clinician: clinician })
    } catch (err) {
        return next(err)
    }
}


module.exports = {
    getClinicianInfo
}