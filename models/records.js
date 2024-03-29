const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    mandatory: Boolean,
    value: Number,
    comment: String,
    outOfTheThreshold: Boolean,
    timestamp: {
        type: Date,
        default: () => Date.now()
    },
}, { _id: false });

const schema = new mongoose.Schema({
    patientId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "patients"
    },
    date: String,
    glucoseLevel: recordSchema,
    weight: recordSchema,
    insulinDoses: recordSchema,
    exercise: recordSchema
});

const Record = mongoose.model('records', schema)

module.exports = Record