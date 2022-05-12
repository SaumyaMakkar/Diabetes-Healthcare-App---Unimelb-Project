const Clinician = require('../models/clinicians');

const getClinicianInfo = async (req, res, next) => {
	try {
		const clinician = await Clinician.findById(
			'6261e9d38bc788f1c0aaa43e'
		).lean();
		if (!clinician) {
			// no clinician found in database
			return res.sendStatus(404);
		}
		// found clinician
		return res.render('clinician_profile', { clinician: clinician });
	} catch (err) {
		return next(err);
	}
};

const updateClinicianProfile = async (req, res, next) => {
	try {
		const clinician = await Clinician.findById(
			'6261e9d38bc788f1c0aaa43e'
		).lean();

		// clinician not found

		if (!clinician) {
			return res.sendStatus(404);
		}

		// clinician found
		const updatedData = await Clinician.findByIdAndUpdate(
			'6261e9d38bc788f1c0aaa43e',
			req.body
		).lean();


		res.redirect('/clinician_profile');
	} catch (error) { }
};

module.exports = {
	getClinicianInfo,
	updateClinicianProfile
};
