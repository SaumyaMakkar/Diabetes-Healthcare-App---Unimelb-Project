const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    patientId: mongoose.Types.ObjectId, 
    type: String,
    value: Number,
    comment: String,
    timestamp: Date
});

const Record = mongoose.model('patients', schema)

module.exports = Record