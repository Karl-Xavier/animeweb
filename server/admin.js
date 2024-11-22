const admin = require('firebase-admin')
const serviceAccount = require('./config/shonenstream-48a83-firebase-adminsdk-copu3-81dbcdabef.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin