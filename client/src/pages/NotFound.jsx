import React, { useEffect } from 'react'
import erroImg from '../assets/404.jpg'

export default function NotFound() {

  useEffect(()=>{
    document.title = '404 - Page Not Found | ShonenStream'
  },[])

  return (
    <div className='w-full grid place-content-center'>
      <h2 className='font-bold'>404 - Page Not Found</h2>
      <img src={erroImg} alt={'404 Not Found'} style={styles.img}/>
      <p className='font-bold'>The Page You Are Looking for does not exist</p>
    </div>
  )
}

const styles = {
  img:{
    width: '100%',
    margin: '5px 0 5px 0'
  }
}