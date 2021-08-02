require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const configure = require('./configure');
const middlewares = require('./backends/middlewares')
const dbUtils = require('./backends/db_utils')

const app = express()

// Configuring middleware and stuffs
MIDDLEWARES = [
    middlewares.loggerMiddleware,
    middlewares.ipFilterMiddleware,
    middlewares.isAuthenticatedOrReadOnlyMiddleware
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

const subscribersRoter = require('./routes/users_api_endpoint')

app.use('/subscribers', subscribersRoter)
















app.listen(8000, ()=>{
    console.log("Server started...")
})