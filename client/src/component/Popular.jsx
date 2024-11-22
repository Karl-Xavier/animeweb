import React, { useEffect, useState } from 'react'
import axios from 'axios'
import img from '../assets/404.jpg'
import Err from './Err'
import { Link } from 'react-router-dom'

export default function Popular() {

  function getStyles(){
    const screen = window.innerWidth
    const breakPoint = 600
    if(screen > breakPoint){
      return styles.container
    }
    return styles.smContainer
  }

  const [ currentStyles, setCurrentStyles ] = useState(getStyles())

  useEffect(()=>{
    function handleresize(){
      setCurrentStyles(getStyles())
    }

    window.addEventListener('resize', handleresize)
    return () => window.removeEventListener('resize', handleresize)
  },[])

  const [ popular, setPopular ] = useState([])
  const [ err, setErr ] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(()=>{
    async function fetchPopular(){
      try {
        const data = await axios.get(`${backendUrl}api/popular`)
        setPopular(data.data)
        setErr(null)
      } catch(err){
        setErr('Something Went Wrong')
      }
    }
    fetchPopular()
  },[])

  if(err){
    return(
      <Err err={err}/>
    )
  }

  return (
    <div>
      <h2 style={{ fontWeight: '600', color: '#eee', fontSize: '1.3rem' }}><strong>POPULAR RANKING</strong></h2>
      <div style={currentStyles} className='my-3'>
      {popular.map((pop, index)=>{
        return(
          <Link to={pop.link} key={index}>
            <div style={styles.card}>
            <img src={pop.imgURL} alt="" style={styles.img} className='img-fluid'/>
            <div>
            <h2 style={{ color:'#6167ff', lineHeight: '16px', height: '34px', overflow: 'hidden' }}>{pop.title}</h2>
            <p><span style={{ color:'#6167ff' }}><b>Latest</b></span>: <span>{pop.latest}</span></p>
            </div>
          </div>
          </Link>
        )
      })}
    </div>
    </div>
  )
}

const styles = {
  container:{
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap:'8px'
  },
  smContainer:{
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap:'8px'
  },
  card:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justiyContent: 'space-between',
    alignItems: 'center',
    gap:'10px',
    padding: '8px',
    boxShadow: '0 4px 10px rgba(255, 255, 255, 0.2)'
  },
  img:{
    width: '60px',
    height: '60px'
  }
}