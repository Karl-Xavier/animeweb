import React, { useEffect, useState } from 'react'
import SliderSkeleton from '../Skeleton/SliderSkeleton'
import { Link } from 'react-router-dom'

export default function Slider({ anislide }) {

  const [ count, setCount ] = useState(0)

  useEffect(() => {
    if (!anislide || anislide.length === 0) return // Wait for data to be available

    const interval = setInterval(() => {
      setCount((prev) => (prev + 1) % anislide.length) // Cycle through slides
    }, 4000)

    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [anislide])

  // Display a loading state if anislide is not yet available
  if (!anislide || anislide.length === 0) {
    return (
      <SliderSkeleton/>
    )
  }

  const currentSlide = anislide[count]

  return (
    <div className='w-full max-w-full h-52 lg:h-72 mb-3 relative'>
      <img src={currentSlide.imgURL} alt={currentSlide.title} style={styles.main} className='w-full lg:w-1/2 lg:absolute lg:right-5'/>
      <h3 className='absolute bottom-0' style={styles.title}>{currentSlide.title.toUpperCase()} - {currentSlide.episodeNum.toUpperCase()}</h3>
      <Link to={currentSlide.link}><button className='absolute' style={styles.button}>Watch</button></Link>
    </div>
  )
}

const styles = {
  main:{
    height: '100%',
    objectFit: 'cover'
  },
  title:{
    background: '#121212',
    color: '#eee',
    padding:'5px',
    maxWidth: '60%',
    fontWeight: '600'
  },
  button:{
    position: 'absolute', 
    bottom: '-20px',
    left: '85%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    backgroundColor: '#643c7d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer', 
  }
}