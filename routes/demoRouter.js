const express = require('express')

// create our Router object
const demoRouter = express.Router()

// require our controller
const demoController = require('../controllers/demoController')

// add a route to handle the GET request for all demo data
demoRouter.get('/', demoController.getAllDemoData)

// add a route to handle the GET request for one data instance
demoRouter.get('/:id', demoController.getDataById)

// add a new JSON object to the database
demoRouter.post('/', demoController.insertData)

// export the router
module.exports = demoRouter