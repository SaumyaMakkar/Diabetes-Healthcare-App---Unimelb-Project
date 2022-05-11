const User = require('../models/users')
const Patient = require('../models/patients')

var format = require('date-fns/format')
var bcrypt = require('bcrypt');


const updatePassword = async (req, res, next) => {

    console.log("updatePassword")
    const userId = req.user._id;

    console.log(req.user)
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return res.json({
                result: "not found"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        console.log(isMatch)
        if (isMatch) {
            user.password = newPassword;
            await user.save();
            return res.json({
                result: true,
                msg: "Password updated"
            })
        } else {
            return res.json({
                result: false,
                msg: "Incorrect password"
            })
        }

    } catch (err) {
        console.log(err)
        return res.json({ result: false, msg: err })
    }
}


const updatePatientDetails = async (req, res, next) => {

    console.log("updatePatientDetails")
    const clientId = req.user.referenceId;

    console.log(req.user)
    try {
        const { givenName, familyName, screenName, yearOfBirth, bio } = req.body;

        const patient = await Patient.findById(clientId);
        console.log(patient)
        if (!patient) {
            return res.json({
                result: false,
                msg:"not found"
            })
        }

        patient.givenName = givenName;
        patient.familyName = familyName;
        patient.screenName = screenName;
        patient.yearOfBirth = yearOfBirth;
        patient.bio = bio;

        await patient.save();
        return res.json({
            result: true,
            msg: "Personal details updated"
        })


    } catch (err) {
        console.log(err)
        return res.json({ result: false, msg: err })
    }
}

const updateTheme = async (req, res, next) => {

    console.log("updateTheme")
    const userId = req.user._id;

    try {
        const { themeName, primaryColor, backgroundColor } = req.body;

        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return res.json({
                result: "not found"
            })
        }
        user.colors.themeName = themeName;
        user.colors.primaryColor = primaryColor;
        user.colors.backgroundColor = backgroundColor;
        await user.save();
        return res.json({
            result: true,
            msg: "Theme updated"
        })


    } catch (err) {
        console.log(err)
        return res.json({ result: false, msg: err })
    }
}

module.exports = {
    updatePassword,
    updateTheme,
    updatePatientDetails
}