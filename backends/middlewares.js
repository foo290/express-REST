const logger = require('../logger/logger')
const allowedIps = require('../settings')
const utils = require('./_utils')
const users = require('../models/user')

const print = new logger.Logger("GMW")
const User = users.User

function loggerMiddleware(req, res, next){
    // req.user = new User()
    print.debug(`Incoming request from user: ${req.user}, HOST: ${utils.getHost(req)}, IP: ${utils.getIP(req)}`)
    next()
}

function ipFilterMiddleware(req, res, next){
    if (!allowedIps.ALLOWED_IPS.includes(utils.getIP(req))){
        print.error('HOST NOT ALLOWED!')
        return res.status(401).json({message: 'Host not allowed in IP filter'})
    }
    print.info("HOST is allowed")
    next()
}

function isAuthenticatedMiddleware(req, res, next){
    if (!utils.isLoggedIn(req)){
        print.error(`User not logged in, IP: ${utils.getIP(req)}`)
        return res.status(401).json({message: "User not loggedIn."})
    }
    next()
}

function isAuthenticatedOrReadOnlyMiddleware(req, res, next){
    const loggedInUser = utils.isLoggedIn(req)
    if (!loggedInUser && req.method !== 'GET'){
        print.error("User not logged in and request is not GET")
        return res.status(401).json({message: "Only read allowed without login"})
    }

    !loggedInUser? print.warning("User not logged in but fetching data using GET"): null
    next()
}

function testing_middleware(req, res, next){
    console.log(req.method === "GET");
    next()
}


module.exports = {
    loggerMiddleware,
    ipFilterMiddleware,
    testing_middleware, 
    isAuthenticatedMiddleware,
    isAuthenticatedOrReadOnlyMiddleware
}

