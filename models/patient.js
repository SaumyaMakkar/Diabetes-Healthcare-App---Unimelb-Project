const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    upperThreshold: Number,
    lowerThreshold: Number,
    type: String
});

const textSchema = new mongoose.Schema({
    date: Date,
    message: String
});

const schema = new mongoose.Schema({
    email: String,
    password: String,
    givenNames: String,
    familyName: String,
    screenName: String,
    dateOfBirth: String,
    dateOfBirth: String, 
    clinicianId: mongoose.Types.ObjectId, 
    requiredRecordsHistory: [recordSchema],
    supportMessages: [textSchema],
    notes: [textSchema]
});

const Patient = mongoose.model('patients', schema)

module.exports = Patient