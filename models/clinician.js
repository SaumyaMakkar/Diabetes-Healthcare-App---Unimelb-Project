const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    email: String,
    password: String,
    givenNames: String,
    familyName: String,
    contactNumber: String,
    yearOfBirth: String,
    bio: String,
    address: {
        address: String,
        citySuburb: String,
        state:String,
        postcode: String,
        country: String
    }
});

const Clinician = mongoose.model('patients', schema)

module.exports = Clinician