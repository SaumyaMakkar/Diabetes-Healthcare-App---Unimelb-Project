// link to model
const demoData = require('../models/demoModel')

// handle request to get all data
const getAllDemoData = (req, res) => {
    res.send(demoData) // send data to browser
}

// handle request to get one data instance
const getDataById = (req, res) => {
    // search the database by ID
    const data = demoData.find(data => data.id === req.params.id)

    // return data if this ID exists
    if (data) {
        res.send(data)
    } else {
        // You can decide what to do if the data is not found.
        // Currently, an empty list will be returned.
        res.send([])
    }
}

// add an object to the database
const insertData = (req,res) => {
    // push the incoming JSON object to the array. (Note, we are not validating the data - should fix this later.)
    demoData.push(req.body)
    // return the updated database
    res.send(demoData)
}

module.exports = {
    getAllDemoData,
    getDataById,
    insertData
}