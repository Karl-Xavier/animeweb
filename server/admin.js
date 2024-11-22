const admin = require('firebase-admin')
//const serviceAccount = require('./config/shonenstream-48a83-firebase-adminsdk-copu3-81dbcdabef.json')
const path = JSON.parse(process.env.FIREBASE_ADMIN_CREDIENTIALS)
console.log(path)

admin.initializeApp({
    credential: admin.credential.cert(path)
})

module.exports = admin