require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const configure = require('./configure');
const middlewares = require('./backends/middlewares')
const dbUtils = require('./backends/db_utils')
const logger = require('./logger/logger')
const settings = require('./settings')

const app = express()
const print = new logger.Logger()

// Configuring middleware and stuffs

MIDDLEWARES = [
    middlewares.loggerMiddleware,
    middlewares.ipFilterMiddleware,
    middlewares.testing_middleware,
    
    middlewares.excludePathFromMiddleware(
        settings.EXCLUDED_PATH_FROM_AUTH_MIDDLEWARE, 
        middlewares.authenticateJwtTokenMiddleware
    ),
    middlewares.excludePathFromMiddleware(
        settings.EXCLUDED_PATH_FROM_AUTH_MIDDLEWARE,
        middlewares.isAuthenticatedOrReadOnlyMiddleware
    ),
    middlewares.excludePathFromMiddleware(
        settings.EXCLUDED_PATH_FROM_AUTH_MIDDLEWARE,
        middlewares.onlyAllowActiveUser
    ),
    
]

configure.apply_middlewares(app, MIDDLEWARES)

db = dbUtils.getMongoDB(
    process.env.DATABASE_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
)

app.use(express.json())

const usersRouter = require('./routes/userApiEndpoint')
const loginSys = require('./routes/loginSys')

app.use('/user', usersRouter)
app.use('/auth', loginSys)




app.listen(8000, ()=>{
    print.info('Server started...')
})