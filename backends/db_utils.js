const mongoose = require('mongoose');
const logger = require('../logger/logger')

const print = new logger.Logger("DbUtils")

function getMongoDB(dbUrl, extra){
    mongoose.connect(dbUrl, extra)

    const db = mongoose.connection
    db.on('error', (error) => print.error(error))
    db.once('open', ()=> print.info("Connected to Database!"))
    return db
}

module.exports = {
    getMongoDB
}