const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const bcrypt = require('bcrypt')
const logger = require('../logger/logger')
const utils = require('./utils')

const print = new logger.Logger("LoginAuth")

// Endpoint for login, this will generate jwt token if the user is pw authenticated.
router.post('/login', (req, res)=>{

    if (req.body){
        print.debug(`JWT Token request recieved by : ${req.body.username}.`)

        // Check if the user exists or not. 
        // If exists, verify username and password.
        // Generate jwt token.
        // Return jwt token for that user
        User.find({'username' : new RegExp(req.body.username, 'i')}, async function(err, userList){
            if (err){
                print.error(`User not found for username: ${req.body.username}`)
                return res.status(404).json({message: "user not found"})
            }
            
            print.info(`user found for username: ${req.body.username}, Authenticating password...`)

            user = userList[0] // assign first result to user as this list will only contain single search result

            try {
                // Authenticate for password
                if (await utils.validatePassword(req, user)){
                    print.info("Password authentication successful, Generating JWT Token...")

                    // Generate jwt token if password is correct.
                    const accessToken = jwt.sign({user: user}, process.env.SECRET_KEY)
                    print.debug("Returning JWT token")
                    
                    return res.json({accessToken: accessToken})
                }
                else{
                    print.error("Password authentication failed!")
                    return res.status(400).json({message: "wrong password"})
                }
            
            } catch (error) {
                print.critical("Something went wrong on server side.")
                return res.status(500).json({message:error.message})
            }
        })
    } else res.json("NO BODY")
})

// Password authentication endpoint
router.post('/pwauth', async (req, res) => {

    User.find({'username' : new RegExp(req.body.username, 'i')}, async function(err, userList){
        if (err) return res.status(404).json({message: "user not found"})

        user = userList[0]
        
        try {
            if (await utils.validatePassword(req, user))
                return res.status(200).json({message: "Password authentication successful"})
            else 
                return res.status(400).json({message: "wrong password"})
        
        } catch (error) {
            return res.status(500).json({message:"something went wrong"})
        }
    })
    
})



module.exports = router
