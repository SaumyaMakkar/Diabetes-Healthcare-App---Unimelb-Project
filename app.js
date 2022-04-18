// Import express
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

/* Routes */
const patientRouter = require('./routes/patientRouter')


/* Express config */

const app = express()

app.use(express.static("public"));

app.engine('hbs', exphbs.engine({
    defaultlayout: "main",
    extname: "hbs"
}))

app.set("view engine", "hbs")

app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})

/* Setting routes */

/* Website */
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/about', (req, res) => {
    res.render("about")
})

app.get('/login', (req, res) => {
    res.render("login")
})

/* Clinician */
app.use('/clinician_dashboard', patientRouter)

app.get('/clinician_patient_data', (req, res) => {
    res.render("clinician_patient_data")
})

app.get('/clinician_patient_support_messages', (req, res) => {
    res.render("clinician_patient_support_messages")
})

app.get('/clinician_patient_notes', (req, res) => {
    res.render("clinician_patient_notes")
})

app.get('/clinician_patient_profile', (req, res) => {
    res.render("clinician_patient_profile")
})

app.get('/clinician_profile', (req, res) => {
    res.render("clinician_profile")
})

app.get('/clinician_patients_comments', (req, res) => {
    res.render("clinician_patients_comments")
})

/* Patient */

app.get('/patient_home', (req, res) => {
    res.render("patient_home")
})

app.get('/patient_records', (req, res) => {
    res.render("patient_records")
})

app.get('/patient_leaderboard', (req, res) => {
    res.render("patient_leaderboard")
})

app.get('/patient_profile', (req, res) => {
    res.render("patient_profile")
})

/* MongoDB config */

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection.on('error', err => {
    console.error(err);
    process.exit(1)
})

db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})

// Tells the app to listen on port 3000 and logs tha tinformation to the console.
app.listen(3000, () => {
    console.log('Demo app is listening on port 3000!')
})


/* process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
  }); */