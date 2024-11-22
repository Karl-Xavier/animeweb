const express = require('express')
const router = express.Router()
const Comment = require('../models/Comments')

router.post('/reply/review/actions', async (req, res) => {
    const { commentId, replyId, userId, action } = req.body
    try {
        // Find the comment containing the reply
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }

        // Find the specific reply in the comment's replies array
        const reply = comment.replies.id(replyId)
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' })
        }

        console.log(reply.likes)

        if(action === 'like'){
            if(reply.likes.includes(userId)){
                console.log(userId)
                reply.likes = reply.likes.filter((id) => id !== userId)
            }else{
                reply.likes.push(userId)
                reply.dislikes = reply.dislikes.filter((id) => id !== userId)
            }
        } else if(action === 'dislike'){
            if(reply.dislikes.includes(userId)){
                console.log(userId)
                reply.dislikes = reply.dislikes.filter((id)=> id !== userId)
            }else{
                reply.dislikes.push(userId)
                reply.likes = reply.likes.filter((id) => id !== userId)
            }
        }

        // Save the updated comment with the updated reply likes/dislikes
        await comment.save()
        
        // Return the updated likes and dislikes of the specific reply
        return res.status(200).json({
            likes: reply.likes,
            dislikes: reply.dislikes
        })

    } catch (err) {
        console.log('Failed to update reply', err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})


router.post('/reply/delete', async(req,res)=>{
    const { id } = req.query
    const { commentId } = req.body
    console.log(id, commentId)
    try{
        const comment = await Comment.findById(commentId)
        if(!comment){
            return res.status(404).json({ message: 'No Comment Found' })
        }
        const reply = comment.replies.find(r => r._id.toString() === id)
        if(!reply){
            return res.status(404).json({ message: 'No reply Found' })
        }

        comment.replies.splice(reply, 1)

        await comment.save()

    }catch(err){
        console.log(err)
    }
})

module.exports = router