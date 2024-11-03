const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/User')
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')
const auth = require('../config/firebase.config')
const sendVerification = require('../sendMail')
const { v4: uuid } = require('uuid')

router.post('/sign-up', async (req,res)=>{
    const { username, email, password } = req.body
    try{
        const existingUser = await User.findOne({ email })
        if(existingUser){
            res.status(400).json({ message: 'Email Already Exists' })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const response = await createUserWithEmailAndPassword(auth, email, password)
        const user = response.user
        const id = user.uid

        const token = uuid()

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            userId: id,
            isVerified: false,
            verificationToken: token
        })

        await newUser.save()
        res.status(200).json({ message: 'User Successfully Registered', id })
        sendVerification(email, token, res)
    }catch(err){
        console.log('Error', err.message)
       return res.status(500).json({ message: err.message })
    }
})

router.post('/login', async(req,res)=>{
    const { email, password } = req.body
    try{
        const existingUser = await User.findOne({ email })
        if(!existingUser){
            res.status(400).json({ message: 'Invalid Email' })
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if(!isValidPassword){
            res.status(400).json({ message: 'Invalid Password' })
        }

        if(!existingUser && !isValidPassword){
            res.status(400).json({ message: 'Invalid User and Password' })
        }

        const response = await signInWithEmailAndPassword(auth, email, password)
        const user = response.user
        const id = user.uid

        res.status(200).json({ message: 'Logged In', id })
    }catch(err){
        console.log('Something Went Wrong')
        if(res.status == 500){
            res.json({ err: err.message })
        }
    }
})

router.get('/verify-email', async (req,res)=>{})

module.exports = router