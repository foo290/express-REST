const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../logger/logger')

const print = new logger.Logger("LoginAuth")

function validateEmail(email){
    return true? emailRegexp.test(email): false
}

function validateEssentialFields(allowedFields, fields){
    for ([key, value] of Object.entries(allowedFields)){
        if (!key in fields || typeof fields[key] != value){
            return false
        }
        return true
    }
}

async function validatePassword(req, user){
    try {
        if (await bcrypt.compare(req.body.password, user.password))
            return true
        else
            return false
    
    } catch (error) {
        print.error("something went wrong during authenticating password")
        return false
    }
}

module.exports = {
    validateEmail,
    validatePassword,
    validateEssentialFields
}