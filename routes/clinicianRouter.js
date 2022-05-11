const express = require('express');

// create our Router object
const clinicianRouter = express.Router();

// require our controller
const clinicianController = require('../controllers/clinicianController');

// add a route to handle the GET request for all demo data
clinicianRouter.get('/', clinicianController.getClinicianInfo);
clinicianRouter.put(
	'/EditClinicianProfile',
	clinicianController.updateClinicianProfile
);

// export the router
module.exports = clinicianRouter;
