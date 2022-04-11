const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    bio: String
})

const Patient = mongoose.model('patients', schema)

module.exports = Patient