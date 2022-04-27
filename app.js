// Import express
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

/* Routes */
const clinicianCommentsRouter = require('./routes/clinicianCommentsRouter')
const clinicianPatientRouter = require('./routes/clinicianPatientRouter')
const clinicianRouter = require('./routes/clinicianRouter')
const patientDashboardRouter = require('./routes/patientDashboardRouter')
// "use strict";

// var hbs = require('hbs');
// var express = require('express');

var format = require('date-fns/format')
/* Express config */

const app = express()

app.use(express.static("public"));

app.engine('hbs', exphbs.engine({
    defaultlayout: "main",
    extname: "hbs",
    helpers: {
        dateFormat: x => {
            return format(x, 'MM/dd/yyyy')
        },
        get: x => {
            return x[0];
        },
        isNull: (v1) => {
            if (v1 == false) return true;
            return false;
        },
        isfill: (v1) => {
            if (v1 == false) return false;
            return true;
        },
        checkOutOfThreshold: (v1) => {
            if (v1 === true) return 'red';
            return '';
        },
        checkMandatoryAndNull: (isMandatory, value) => {
            console.log(isMandatory, value);
            if (isMandatory && value === null) {
                return 'yellow';
            }
            return ' ';
        }, checkLength: (v1) => {
            if (v1 === "") {
                return false;
            }
            return true;
        },
        getCurrentDate: () => Date.now(),

    }
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
app.use('/clinician_dashboard', clinicianPatientRouter)

app.use('/clinician_profile', clinicianRouter)

app.use('/clinician_patients_comments', clinicianCommentsRouter)

/* Patient */

app.use('/patient_home', patientDashboardRouter)

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