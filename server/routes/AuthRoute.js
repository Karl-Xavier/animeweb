const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/User')
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth')
const auth = require('../config/firebase.config')
const admin = require('../admin')
const sendVerification = require('../sendMail')
const { v4: uuid } = require('uuid')

// SignUp Route //

router.post('/sign-up', async (req,res)=>{
    const { username, email, password, profileImg } = req.body
    try{
        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.status(400).json({ message: 'Email Already Exists' })
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
            profileImg,
            userId: id,
            isVerified: false,
            verificationToken: token
        })

        await newUser.save()
        sendVerification(email, token, res)
        res.json({ message: `A verification Email has been sent to ${email}`, id })
    }catch(err){
        console.log('Error', err.message)
        return res.status(500).json({ message: err.message })
    }
}) 

// Login Route //
router.post('/login', async(req,res)=>{
    const { email, password } = req.body
    try{
        const existingUser = await User.findOne({ email })
        if(!existingUser){
            return res.status(400).json({ message: 'Invalid Email' })
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if(!isValidPassword){
           return res.status(400).json({ message: 'Invalid Password' })
        }

        if(!existingUser && !isValidPassword){
            return res.status(400).json({ message: 'Invalid User and Password' })
        }

        if(existingUser.isVerified === false){
            return res.status(400).json({ message: 'Verify Your email Address to proceed' })
        }

        const response = await signInWithEmailAndPassword(auth, email, password)
        const user = response.user
        const id = user.uid

        res.json({ message: 'Logged In', id })
    }catch(err){
        console.log('Something Went Wrong')
        if(res.status == 500){
            res.json({ err: err.message })
        }
    }
})

// Verify Email Route //
router.get('/verify', async (req,res)=>{
    const { token } = req.query
    try {
        const user = await User.findOne({ verificationToken: token })
        if(!user){
            return res.status(400).json({ success: false, message: 'Invalid or Expired Token' })
        }
        user.isVerified = true
        user.verificationToken = undefined
        await user.save()
        res.json({ message: 'Email Verified' })
    } catch(err){
        console.log('Error Verifying email', err.message)
        return res.status(500).json({ success: false, message: 'An Error Occurred while verifying the email' })
    }
})

// Reset Password Route //
// Verify Reset Password Route //

// Delete User Route //
router.get('/delete', async(req,res)=>{
    const { id } = req.query
    try{
        const existingUser = User.findOne({ userId: id })
        if(!existingUser){
            return res.status(400).json({ message: 'There\'s no Such user '})
        }
        await admin.auth().deleteUser(id)
        const result = await User.findOneAndDelete({ userId: id })
        if(result){
            return res.status(200).json({ message: 'User Account Deleted' })
        }
    }catch(err){
        console.log('An Error Occurred', err)
        return res.status(500).json({ message: 'Something Went Wrong' })
    }
})

module.exports = router 