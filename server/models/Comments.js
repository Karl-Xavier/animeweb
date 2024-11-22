const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    userId: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const commentSchema = new mongoose.Schema({
    animeEp: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    imgUrl:{
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    replies: [replySchema],
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    userId:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment