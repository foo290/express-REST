const express = require('express');
const router = express.Router()
const Subscriber = require('../models/subscriber')

const logger = require('../logger/logger')

const log = new logger.Logger()


// Get all
router.get('/',async (req, res)=>{
    log.info("Get request recieved for all!")
    try {
        const subs = await Subscriber.find()
        res.json(subs)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// Get one
router.get('/:id', getSubscriber, (req, res)=>{
    log.info(`Get request recieved for id : ${req.params.id}`)
    res.send(res.subscriber)
})

//Create one
router.post('/', async (req, res)=>{
    log.info(`Post request recieved`)

    const subs = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newSubs = await subs.save()
        res.status(201).json(newSubs)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
// update one
router.patch('/:id', getSubscriber, async(req, res)=>{
    log.info(`Patch request recieved for id : ${req.params.id}`)
    if (req.body.name != null){
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null){
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }

    try {
        const updated = await res.subscriber.save()
        res.json(updated)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Delete one
router.delete('/:id',getSubscriber, async(req, res)=>{
    log.info(`Delete request recieved for id : ${req.params.id}`)
    try {
        await res.subscriber.remove()
        res.status(200).json({message: "deleted!"})
    } catch (error) {
        res.status(500).json(error.message)
    }
})


// Middleware
async function getSubscriber(req, res, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null){
            return res.status(404).json({message: "Cannot find user"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.subscriber = subscriber
    next()
}

module.exports = router