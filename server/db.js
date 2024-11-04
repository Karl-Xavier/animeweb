const mongoose = require('mongoose')
const nodeEnv = require('./config/nodeEnv')

const mongoURI = nodeEnv === 'production' ? 'mongodb+srv://uwasbruno256:7pZuPhKNAZBNwRMD@shonenstream.pt6qv.mongodb.net/shonenstream?retryWrites=true&w=majority&appName=shonenstream' : 'mongodb://localhost:27017/shonenstream'

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