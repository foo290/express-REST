const logger = require('../logger/logger')
const allowedIps = require('../settings')
const utils = require('./_utils')
const users = require('../models/user')
const jwt = require('jsonwebtoken')

const print = new logger.Logger("GMW")
const User = users.User

function loggerMiddleware(req, res, next){
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

function onlyAllowActiveUser(req, res, next){
    print.debug("Allowing Active users only.")
    if (!req.user.isActive){
        print.error("User account is not activated")
        return res.status(401).json({message:"Account not activated"})
    }
    next()

}

function testing_middleware(req, res, next){
    console.log(req.method === "GET");
    console.log(req.path);
    next()
}

function authenticateJwtTokenMiddleware(req, res, next){
    print.debug("Verifying JWT token...")
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
        print.error("Token not provided.")
        return res.status(401)
    }
    
    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if (err){
            print.error("Token found but not valid!")
            return res.status(403)
        }
        print.info("User token Authenticated successfully!")
        req.user = user.user
        next()
    })
}

function excludePathFromMiddleware(path, middleware){
    return function(req, res, next){
        if (path.includes(req.path)) {
            print.warning("This path is excluded from JWT authentication middleware.")
            next()
        }
        else {
            return middleware(req, res, next)
        }
    }
}


module.exports = {
    loggerMiddleware,
    ipFilterMiddleware,
    testing_middleware, 
    isAuthenticatedMiddleware,
    isAuthenticatedOrReadOnlyMiddleware,
    authenticateJwtTokenMiddleware,
    excludePathFromMiddleware,
    onlyAllowActiveUser
}

