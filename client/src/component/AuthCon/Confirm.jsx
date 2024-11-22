import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Confirm() {
    const [ isVerified, setIsVerified ] = useState('Verify Email....')
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get('token')

    useEffect(()=>{
        async function verifyEmail(){
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            try {
                await axios.get(`${backendUrl}api/auth/verify?token=${token}`)
                setIsVerified('Email Verification Successful')
                setTimeout(()=>{
                    navigate('/')
                }, 3000)
            } catch(err){
                console.log('Verification Error', err)
                setIsVerified('Email Verification Failed')
            }
        }
        if(token){
            verifyEmail()
        }
    },[token, navigate])

    useEffect(()=>{
        document.title = 'Confirm Your Email | Shonenstream'
    },[])

  return (
    <div className='w-full h-dvh grid place-content-center text-center'>
        <p>{isVerified}</p>
    </div>
  )
}
