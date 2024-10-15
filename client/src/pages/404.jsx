import React, { useEffect } from 'react'
import notfound from '../assets/404.jpg'

export default function Err() {

    useEffect(()=>{
        document.title = 'Page Not Found'
    },[])

  return (
    <div className='container flex flex-col items-center justify-center' style={{ height: '300px' }}>
        <img src={notfound} alt="Not Found" style={styles.img}/>
        <h3 style={styles.h3}>The Page you are looking for does not exists</h3>
    </div>
  )
}

const styles = {
    img: {
        width: '65%',
        height: '90%'
    },
    h3:{
        margin: '10px 0 0 0'
    }
}