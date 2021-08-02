require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")


const app = express()
const print = console.log

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', ()=> print("connected to database"))



app.use(express.json())

const subscribersRoter = require('./routes/subscriber')

app.use('/subscribers', subscribersRoter)
















app.listen(8000, ()=>{
    console.log("Server started...")
})