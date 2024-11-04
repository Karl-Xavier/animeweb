const nodeMailer = require('nodemailer')
const nodeEnv = require('./config/nodeEnv')

const verificationLink = nodeEnv === 'production' ? 'https://myanimetv.vercel.app/confirmation' :'http://localhost:5173/confirmation'

async function sendVerification(email, token, res){
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'contactshonenstream@gmail.com',
            pass: 'xxcvxhsjjaznhgte'
        }
    })

    try {
        const info = await transporter.sendMail({
            from:{
                name: 'ShonenStream',
                address: 'contactshonenstream@gmail.com'
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