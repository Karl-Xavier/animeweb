const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

/* 
    apiKey: "AIzaSyDT7lEUiOtFkFtyPsup6oW-WoGkpueOiV0",
    authDomain: "shonenstream-48a83.firebaseapp.com",
    projectId: "shonenstream-48a83",
    storageBucket: "shonenstream-48a83.firebasestorage.app",
    messagingSenderId: "690121768870",
    appId: "1:690121768870:web:5ceab7dfa789fbc7101967"
*/

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

module.exports = auth