const express = require('express');
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const utils = require('./utils')
const settings = require('../settings')

const logger = require('../logger/logger');

const log = new logger.Logger()


// Get all
router.get('/',async (req, res)=>{
    log.info("Get request recieved for all!")
    try {
        const subs = await User.find()
        res.json(subs)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// Get one
router.get('/:id', getUser, (req, res)=>{
    log.info(`Get request recieved for id : ${req.params.id}`)
    res.send(res.user)
})

//Create one
router.post('/create', async (req, res)=>{
    log.info(`Post request recieved`)
    
    if (!utils.validateEssentialFields(settings.SIGNUP_ESSENTIALS, req.body)){
        log.error("Essential fields not provided for sign up.")
        return res.status(401).json({message: "Essentials fields are not provided", "fields": settings.SIGNUP_ESSENTIALS})
    }
    if (!utils.validateEmail(req.body.email)){
        log.error("Email format is not valid")
        return res.status(401).json({message: "Email format is not valid"})
    }

    try {
        const hashedPw = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPw
        req.body.isActive = true

        const user = new User(req.body)
        try {
            const newUser = await user.save()
            res.status(201).json(newUser)
        } catch (error) {
            res.status(400).json({message: error.message})
        }

    } catch (error) {
        res.status(500).json({message: error.message})
    }

})

// update one
router.patch('/update/:id', getUser, async(req, res)=>{
    log.info(`Patch request recieved for id : ${req.params.id}`)
    let equalToBefore = true
    try {
        Object.keys(req.body).map(key => {
            if (res.user[key] != req.body[key]) {
                res.user[key] = req.body[key]
                equalToBefore = false
                log.debug(`${key} updated in patch!`)
            }
        })

        let updated = {user: await res.user.save(), updatePerformed: !equalToBefore}

        if (!equalToBefore){
            log.debug("Object updated, Generating updated access JWT token...")
            const updatedAccessToken = jwt.sign({user: updated}, process.env.SECRET_KEY)
            updated = Object.assign(updated, {updatedAccessToken: updatedAccessToken})
        }

        res.json(updated)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Delete one
router.delete('/delete/:id',getUser, async(req, res)=>{
    log.info(`Delete request recieved for id : ${req.params.id}`)
    try {
        await res.user.remove()
        res.status(200).json({message: "deleted!"})
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// Middleware
async function getUser(req, res, next) {
    let user
    try {

        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({message: "Cannot find user"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.user = user
    next()
}

module.exports = router