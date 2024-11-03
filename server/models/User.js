const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true, unique: true },
    profileImg: { type: String, required: false, default: '' },
    userId:{ type: String },
    isVerified: {type: Boolean, default: false},
    verificationToken: { type: String }
})

const User = mongoose.model('user', userSchema)

module.exports = User