const nodeMailer = require('nodemailer')
const nodeEnv = require('./config/nodeEnv')
const path = require('path')

const verificationLink = nodeEnv === 'production' ? 'https://myanimetv.vercel.app/confirmation' :'http://localhost:5173/confirmation'
const date = new Date()
const year = date.getFullYear()

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
            html: `
                <h1>Verify Your Email</h1>
                <p><a href=${verificationLink}?token=${token}>Click Here</a></p>
                <p> This email was intended for ${email}</p>
            `,
        })
        console.log('Email Sent')
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = sendVerification