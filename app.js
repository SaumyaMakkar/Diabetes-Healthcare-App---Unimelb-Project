// Import express
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const flash = require('express-flash')  // for showing login error messages
const session = require('express-session')  // for managing user sessions
const MongoStore = require('connect-mongo')
const socket = require("socket.io");

/* Routes */
const clinicianCommentsRouter = require('./routes/clinicianCommentsRouter')
const clinicianPatientRouter = require('./routes/clinicianPatientRouter')
const clinicianRouter = require('./routes/clinicianRouter')
const patientDashboardRouter = require('./routes/patientDashboardRouter')
const patientProfileRouter = require('./routes/patientProfileRouter')
const patientRecordsRouter = require('./routes/patientRecordsRouter')
const patientLeaderboardRouter = require('./routes/patientLeaderboardRouter')


var format = require('date-fns/format')

/* Express config */
const app = express()

app.use(express.json());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())

app.engine('hbs', exphbs.engine({
    defaultlayout: "main",
    extname: "hbs",
    helpers: {
        dateFormat: x => {
            return format(x, 'dd/MM/yyyy')
        },
        hasBadged: rate => {
            console.log("hasBadget")
            return rate >= 40 ? true : false
        },
        dateHourFormat: x => {
            return format(x, 'dd/MM/yyyy hh:mm aaa')
        },
        setColors: values => {
            console.log("colors")
            console.log(values)
            return false;
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
            if (v1 === true) return 'wt-color-red';
            return '';
        },
        checkLength: (v1) => {
            if (v1 === "") {
                return false;
            }
            return true;
        },

    }
}))

app.set("view engine", "hbs");


/* MongoDB config */

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongooseClient = mongoose.connect('mongodb+srv://diabetes_user:diabetes_user@ausdev.iom05.mongodb.net/diabetes_at_home', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((m) => m.connection.getClient())

const db = mongoose.connection.on('error', err => {
    console.error(err);
    process.exit(1)
})

db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})

/* Session config */
app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'diabetes_at_home', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', //  to work on Heroku
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3000000 // sessions expire after 5 minutes
        },
        store: MongoStore.create({ clientPromise: mongooseClient }),
    })
)

// Initialise Passport.js
const passport = require('./middleware/passport.js')
app.use(passport.authenticate('session'))

// Load authentication router
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

app.use((req, res, next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})

/* Setting routes */

/* Website */
app.get('/', (req, res) => {
    console.log("index")
    res.render("index")
})

app.get('/about', (req, res) => {
    res.render("about")
})

// Login page (with failure message displayed upon login failure)
app.get('/login', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login' })
})

/* Clinician */
app.use('/clinician_dashboard', clinicianPatientRouter)

app.use('/clinician_profile', clinicianRouter)

app.use('/clinician_patients_comments', clinicianCommentsRouter)

/* Patient */
app.use('/patient_home', patientDashboardRouter)

app.use('/patient_records', patientRecordsRouter)

app.use('/patient_leaderboard', patientLeaderboardRouter)

app.use('/patient_profile', patientProfileRouter)
app.get('/patient_charts', (req, res) => {
    res.render("patient_charts")
})


// App config
const port = process.env.PORT || 3000;

// Tells the app to listen on port 3000 and logs tha tinformation to the console.
const server = app.listen(port, () => {
    console.log('Demo app is listening on port ' + port + '!')
})

/* Socket IO */
const io = socket(server);

/* Socket IO */
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('notification', (msg) => {
        console.log("notification arrived:");
        console.log(msg);
        console.log(io.sockets)

        io.emit('notification', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

/* process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
  }); */