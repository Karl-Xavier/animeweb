import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Err from '../Err'
import HomeSkeleton from '../Skeleton/HomeSkeleton'
import { Link } from 'react-router-dom'

export default function Content() {

  function getStyles(){
    const screen = window.innerWidth
    const breakPoint = 900
    const breakpoint2 = 600
    if(screen > breakPoint){
        return styles.bigScreen
    }else if(screen <= breakpoint2){
        return styles.smScreen
    }else{
        return styles.midScreen
    }
}

const [currentStyles, setCurrentStyles] = useState(getStyles())

useEffect(()=>{
    function handleResize(){
        setCurrentStyles(getStyles())
    }

    window.addEventListener('resize', handleResize)

    return ()=>{
        window.removeEventListener('resize', handleResize)
    }
},[])

  const [ movies, setMovies ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ err, setErr ] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(()=>{
    async function fetchAllMovies(){
      try {
        const response = await axios.get(`${backendUrl}api/movies`)
        setMovies(response.data)
        setLoading(false)
        setErr(null)
      } catch (error) {
        setLoading(false)
        setErr('Something Went Wrong')
      }
    }
    fetchAllMovies()
  },[])

  useEffect(() => {
    document.title = 'Watch Anime Movies Online'
  }, [])

  if(loading){
    return(
        <HomeSkeleton/>
    )
}
if(err){
    return(
        <Err err={err}/>
    )
}

  return (
    <div className='container grid place-content-center'>
      <h3 style={{ fontWeight: '600', color: '#643c7d' }}><strong>MOVIES</strong></h3>
        <div className="my-3" style={currentStyles}>
            {movies.map((movie, index) => {
                return (
                 <div key={index} className="w-40 h-72 lg:w-48 md:w-44 text-center">
                   <Link to={movie.link}>
                   <img style={styles.img} src={movie.imgURL} alt="" className="img-fluid" />
                   <p style={styles.title}>{movie.title}</p>
                   <span style={styles.episode}>{movie.released}</span>
                   </Link>
                 </div>
                )
            })}
        </div>
    </div>
  )
}

const styles = {
  img:{
      width: '100%',
      height: '75%',
      objectFit: 'cover',
      margin: '0 0 2px 0'
  },
  episode: {
      textAlign: 'center',
      fontWeight: '500',
  },
  title: {
    maxWidth: '100%',
    color: '#6167ff',
    fontWeight: '600',
    lineHeight: '16px',
    height: '33px',
    overflow: 'hidden',
    margin: '5px 0 0 0',
    fontFamily: 'Oswald'
  },
  bigScreen:{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '12px',
  },
  midScreen:{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
  },
  smScreen:{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
  }
}