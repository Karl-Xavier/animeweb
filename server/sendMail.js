const nodeMailer = require('nodemailer')
const nodeEnv = require('./config/nodeEnv')

const verificationLink = nodeEnv === 'production' ? process.env.FRONTEND_PROD : process.env.FRONTEND_DEV

async function sendVerification(email, token, res){
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })

    try {
        const info = await transporter.sendMail({
            from:{
                name: 'ShonenStream',
                address: process.env.USER
            },
            to: email,
            subject: 'Email Verification',
            html: `<h1>Verify your Email Address</h1>
            <p><a href='${verificationLink}?token=${token}'>Click Here to Verify Your Email</a></p>
            <span>This Email was intended for ${email}</span>`
        })
        console.log('Email Sent')
        res.json({ message: 'Email Sent' })
    } catch (err) {
        console.log(err.message)
        res.json({ message: 'Could Not Send Verification Email' })
    }
}

module.exports = sendVerification