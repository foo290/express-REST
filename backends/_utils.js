const users = require('../models/user')
const User = users.User


function getIP(req, raw=false){
    return raw? req.ip: req.ip.split(':').slice(-1).pop()
}

function getHost(req){
    return req.headers.host
}

function isLoggedIn(req){
    return req.user != null
}

module.exports = {
    getIP,
    getHost,
    isLoggedIn
}