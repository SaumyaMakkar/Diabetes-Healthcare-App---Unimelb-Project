const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    fromDate: {
        type: Date,
        default: () => Date.now()
    },
    records: {
        glucoseLevel: {
            upperThreshold: Number,
            lowerThreshold: Number,
            mandatory: Boolean
        },
        weight: {
            upperThreshold: Number,
            lowerThreshold: Number,
            mandatory: Boolean
        },
        insulineDoses: {
            upperThreshold: Number,
            lowerThreshold: Number,
            mandatory: Boolean
        },
        exercise: {
            upperThreshold: Number,
            lowerThreshold: Number,
            mandatory: Boolean
        }
    }
}, { _id: false });

const textSchema = new mongoose.Schema({
    date: Date,
    message: String
});

const schema = new mongoose.Schema({
    email: String,
    password: String,
    urlImage: String,
    givenName: String,
    familyName: String,
    screenName: String,
    yearOfBirth: String,
    bio: String,
    clinicianId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "clinicians"
    },
    requiredRecordsHistory: [recordSchema],
    supportMessages: [textSchema],
    notes: [textSchema]
});

const Patient = mongoose.model('patients', schema)

module.exports = Patient