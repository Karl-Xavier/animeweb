const mongoose = require('mongoose')
const nodeEnv = require('./config/nodeEnv')

const mongoURI = nodeEnv === 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log('Connection to DB Established')
    } catch(err){
        console.log('An Error Occurred ',err)
        process.exit(1)
    }
}

module.exports = connectDB