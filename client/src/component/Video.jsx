import React, { useRef, useState } from 'react'

export default function Video({ video }) {

    console.log(video)

    const iframeRef = useRef(null)

  return (
    <div className='relative w-full h-64'>
        <div style={styles.outer}>
            <iframe 
                ref={iframeRef} 
                src={video}
                allow="autoplay; fullscreen" 
                title="Video"
                style={styles.iframe}
                frameborder="0" marginwidth="0" marginheight="0" scrolling='no'
            ></iframe>
        </div>
    </div>
  )
}

const styles = {
  outer:{
    padding: 0,
    minHeight: '260px',
    minWidth: '100%',
    background: '#242424'
  },
  iframe: {
    width: '100%',
  /* height: window.innerWidth < 768 && '280' || window.innerWidth > 768 && '600' || window.innerWidth == 768 && '300' */height: '100%',
  border: 'none',
  display: 'block',
  position: 'absolute'
  }
}