const mongoose = require('mongoose')

const bookMarkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true
    },
    episode: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

const Bookmark = mongoose.model('bookmark', bookMarkSchema)

module.exports = Bookmark