import React, { useEffect } from 'react'
import logo from '../../assets/animeTvlogo2.jpg'

export default function Verify() {

  useEffect(()=>{
    document.title = 'Verify Your Email | Shonenstream'
  },[])

  return (
    <div className='w-full h-dvh grid place-content-center text-center'>
        <h2>A VERIFICATION EMAIL HAS BEEN SENT</h2>
        <p>If the verification email is not seen, check spam for the email</p>
    </div>
  )
}
