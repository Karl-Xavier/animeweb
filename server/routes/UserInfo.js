const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/info/user', async(req,res)=>{
    const { id } = req.query
    try{
        const user = await User.findOne({ userId: id })
        if(!user){
            return res.status(400).json({ message: 'User does not exists' })
        }
        res.json(user)
    }catch(err){
        console.log('An error occurred',err)
        return res.status(500).json({ message: err.message })
    }
})

router.post('/info/editUser', async(req,res)=>{
    const { id } = req.query
    const { username, profileImg } = req.body
    try{
        const user = await User.findOne({ userId: id })
        if(!user){
            return res.status(400).json({ message: 'User Does Not Exist' })
        }

        const updates = {}

        if(username && username.trim() !== ''){
            updates.username = username
        }
        if(profileImg && profileImg.trim() !== ''){
            updates.profileImg = profileImg
        }

        if(Object.keys(updates).length === 0){
            return res.status(400).json({ message: 'No Changes' })
        }

        await User.findOneAndUpdate({ userId: id }, updates, {new: true})
        return res.status(200).json({ message: 'User Profile Edited' })
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router 