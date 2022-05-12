const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    email: String,
    password: String,
    urlImage: String,
    givenName: String,
    familyName: String,
    headline: String,

    contactNumber: String,
    yearOfBirth: String,
    bio: String,
    address: {
        address: String,
        citySuburb: String,
        state: String,
        postcode: String,
        country: String
    }
});

const Clinician = mongoose.model('clinicians', schema)

module.exports = Clinician