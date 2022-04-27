const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    mandatory: Boolean,
    comment: String,
    outOfTheThreshold: Boolean,
    value: Number,
    comment: String,
    timestamp: {
        type: Date,
        default: () => Date.now()
    },
}, { _id: false });

recordSchema.pre("save", async function (next) {
    this.timestamp = new Date();
    next();
})

const schema = new mongoose.Schema({
    patientId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "patients"
    },
    date: {
        type: Date,
        default: () => Date.now()
    },
    glucoseLevel: recordSchema,
    weight: recordSchema,
    insulineDoses: recordSchema,
    exercise: recordSchema
});

const Record = mongoose.model('records', schema)

module.exports = Record