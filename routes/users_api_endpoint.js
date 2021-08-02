const express = require('express');
const router = express.Router()
const User = require('../models/user')

const logger = require('../logger/logger')

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
router.post('/', async (req, res)=>{
    log.info(`Post request recieved`)

    const subs = new User(req.body)
    try {
        const newSubs = await subs.save()
        res.status(201).json(newSubs)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
// update one
router.patch('/:id', getUser, async(req, res)=>{
    log.info(`Patch request recieved for id : ${req.params.id}`)
    if (req.body.name != null){
        res.user.name = req.body.name
    }
    if (req.body.subscribedToChannel != null){
        res.user.subscribedToChannel = req.body.subscribedToChannel
    }

    try {
        const updated = await res.user.save()
        res.json(updated)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Delete one
router.delete('/:id',getUser, async(req, res)=>{
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