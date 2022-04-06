// Import express
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const app = express()

app.use(express.static("public"));

app.engine('hbs', exphbs.engine({
    defaultlayout: "main",
    extname: "hbs"
}))

app.set("view engine", "hbs")

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/dashboard', (req, res) => {
    res.render("dashboard")
})

app.get('/profile', (req, res) => {
    res.render("profile")
})

app.get('/patient_comments', (req, res) => {
    res.render("patient_comments")
})

app.get('/food/:id', (req, res) => {
    res.render("showFood",{
        foodId : req.params.id
    })
})

// Tells the app to listen on port 3000 and logs tha tinformation to the console.
app.listen(3000, () => {
    console.log('Demo app is listening on port 3000!')
})