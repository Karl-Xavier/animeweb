const express = require('express')
const router = express.Router()
const Bookmark = require('../models/Bookmark')
const User = require('../models/User')

router.post('/bookmark/add', async(req,res)=>{
    const { id } = req.query
    const { title, imgUrl, episode, link } = req.body
    try{
        const existingUser = await User.findOne({ userId: id })
        if(!existingUser){
            return res.status(400).json({ message: 'User Does Not Exist' })
        }
        const existingBook = await Bookmark.findOne({ title })
        if(existingBook){
            return res.status(400).json({ message: 'BookMark Already Exists' })
        }

        const newBook = new Bookmark({
            title,
            imgUrl,
            episode,
            link,
            userId: id
        })

        await newBook.save()
        return res.status(200).json({ message: 'Bookmarked! Check Profile' })
    }catch(err){
        console.log('An Error Occurred',err)
        return res.status(500).json({ message: err.message })
    }
})

router.get('/bookmark/get', async(req,res)=>{
    const { id } = req.query
    try {
        const existingBook = await Bookmark.find({ userId: id })
        const existingUser = await User.findOne({ userId: id })
        if(!existingUser){
            return res.status(400).json({ message: 'No User Found' })
        }
        res.status(200).json(existingBook)
    } catch(err){
        console.log('An Error Occurred',err)
        return res.status(500).json({ message: err.message })
    }
})

router.get('/bookmark/delete', async(req,res)=>{
    const { id } = req.query
    try {
        const response = await Bookmark.findByIdAndDelete({ _id: id })
        if(response){
            return res.status(200).json({ message: 'Removed 1 Bookmark' })
        }
    }catch(err){
        console.log('An Error Occurred',err)
        return res.status(500).json({ message: err.message })   
    }
})

module.exports = router