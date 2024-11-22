const express = require('express')
const router = express.Router()
const Comment = require('../models/Comments')
const mongoose = require('mongoose')

router.get('/get/comment', async(req,res)=>{
    const { relateTo } = req.query
    try {
        const comment = await Comment.find({ animeEp: relateTo }).sort({ createdAt: -1 })

        function getTotalLength(){
            const countReplies = (replies) => {
                if(!replies || replies.length === 0) return 0
                let count = replies.length
    
                replies.forEach(reply =>{
                    if(reply.replies && reply.replies.length > 0){
                        count += countReplies(reply.replies)
                    }
                })
                return count
            }

            let totalCount = 0

            comment.forEach(comment => {
                totalCount += 1
                if(comment.replies && comment.replies.length > 0){
                    totalCount += countReplies(comment.replies)
                }
            })
            return totalCount
        }

        const total = getTotalLength()

        return res.status(200).json({comment,total})
    } catch(err){
        console.log(err)
    }
})


router.post('/post/comment', async(req,res)=>{
    const { animeEp, username, imgUrl, content, userId } = req.body
    try{
        if(!content){
            return res.status(400).json({ message: 'Enter a valid message body' })
        }
        const newComment = new Comment({
            animeEp,
            username,
            imgUrl,
            content,
            replies: [],
            like: [],
            dislikes: [],
            userId,
            _id: new mongoose.Types.ObjectId()
        })
        await newComment.save()
    }catch(err){
        console.log('An Error Occurred',err)
        return res.status(500).json({ message: 'An Error Occurred' })
    }
})

router.post('/comment/action', async(req,res)=>{
    const { commentId, userId, action } = req.body
    try{
        const comment = await Comment.findById(commentId)
        if(!comment){
            return res.status(404).json({ message: 'Comment not found' })
        }
        if(action === 'like'){
            if(comment.likes.includes(userId)){
                comment.likes = comment.likes.filter((id)=> id !== userId)
            }else{
                comment.likes.push(userId)
                comment.dislikes = comment.dislikes.filter((id)=> id !== userId)
            }
        }else if(action === 'dislike'){
            if(comment.dislikes.includes(userId)){
                comment.dislikes = comment.dislikes.filter((id)=> id !== userId)
            }else{
                comment.dislikes.push(userId)
                comment.likes = comment.likes.filter((id)=> id !== userId)
            }
        }
        await comment.save()
        return res.status(200).json({
            likes: comment.likes,
            dislikes: comment.dislikes
        })
    }catch(err){
        console.log('Failed to Upload Comment')
    }
})

router.post('/comment/delete', async(req,res)=>{
    const { id } = req.query
    console.log(id)
    try{
        const comment = await Comment.findByIdAndDelete(id)
        if(!comment){
            return res.status(404).json({ message: 'No comment found' })
        }
    }catch(err){
        console.log('An error occurred',err.message)
        return res.status(500).json({ message: err.message })
    }
})

router.post('/comment/reply', async (req, res) => {
    const { username, imgUrl, content, userId, parentId } = req.body

    try {

        const findReply = (replies, parentId) => {
            for (let reply of replies) {
                if (reply._id.toString() === parentId.toString()) {
                    return reply
                }
        
                const foundReply = findReply(reply.replies, parentId)
                if (foundReply) {
                    return foundReply
                }
            }
        
            return null
        }
        

        if (!content) {
            return res.status(400).json({ message: 'Enter a valid message body' })
        }

        const allComments = await Comment.find()

        let targetComment = null
        for (let comment of allComments) {
            if (comment._id.toString() === parentId.toString()) {
                targetComment = comment
                break
            }
            const foundReply = findReply(comment.replies, parentId)
            if (foundReply) {
                targetComment = comment
                break
            }
        }

        if (!targetComment) {
            return res.status(404).json({ message: 'No Comment or Reply Found' })
        }

        const newReply = {
            username,
            imgUrl,
            content,
            likes: [],
            dislikes: [],
            userId,
            parentId,
            _id: new mongoose.Types.ObjectId(),
        }

        const addReply = (replies, parentId, newReply) => {
            for (let reply of replies) {
                if (reply._id.toString() === parentId.toString()) {
                    reply.replies.push(newReply)
                    return true
                }
                if (addReply(reply.replies, parentId, newReply)) {
                    return true
                }
            }
            return false
        }

        if (targetComment._id.toString() === parentId.toString()) {
            targetComment.replies.push(newReply)
        } else {
            const replyAdded = addReply(targetComment.replies, parentId, newReply)
            if (!replyAdded) {
                return res.status(404).json({ message: 'Reply not added' })
            }
        }

        await targetComment.save()

        return res.status(200).json({ content: newReply })
    } catch (err) {
        console.error('An Error Occurred:', err)
        return res.status(500).json({ message: 'Server Error' })
    }
})


module.exports = router