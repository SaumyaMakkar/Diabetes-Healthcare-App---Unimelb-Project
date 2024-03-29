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
        insulinDoses: {
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
    date: {
        type: Date,
        default: () => Date.now()
    },
    message: String
}, { _id: false });

const schema = new mongoose.Schema({
    email: String,
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
    notes: [textSchema],
    record_patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'records' 
    },
    createdDate: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
});

const Patient = mongoose.model('patients', schema)

module.exports = Patient