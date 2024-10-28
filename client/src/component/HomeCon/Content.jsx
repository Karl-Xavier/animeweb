import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import Err from '../Err'
import HomeSkeleton from '../Skeleton/HomeSkeleton'
import Slider from './Slider'
import { Link } from 'react-router-dom'
import Popular from '../Popular'

export default function Content() {

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 768
        if(screen > breakPoint){
            return styles.bigScreen
        }else if(screen < breakPoint){
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

    const [recentEpisode, setRecentEpisode] = useState([])
    const [ lastThree, setLastThree ] = useState([])
    const [ err, setErr ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    console.log(backendUrl)

    useEffect(()=>{
        async function fetchNewData(){
            try{
                const response = await axios.get(`${backendUrl}api/recent`)
                setRecentEpisode(response.data)
                setLastThree(response.data.slice(-3))
                setLoading(false)
                setErr(null)
                alert('If Page Refuses to Scroll, Tap on the screen')
            }catch(err){
                setLoading(false)
                setErr('Something Went Wrong')
            }
        }
        fetchNewData()
    },[])

    useEffect(() => {
          document.title = 'Watch, Stream and Download Anime Online for free - ShonenStream'
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
        <Slider anislide={lastThree}/>
        <h2 style={{ fontWeight: '600', color: '#643c7d', fontSize: '1.3rem', }}><strong>RECENT RELEASE</strong></h2>
        <div className="my-3" style={currentStyles}>
            {recentEpisode.map((episode, index) => {
                return (
                 <Link to={episode.link} key={index}>
                    <div className="w-40 h-72 lg:w-48 md:w-44 text-center">
                   <img style={styles.img} src={episode.imgURL} alt="" className="img-fluid" />
                   <p style={styles.title}>{episode.title}</p>
                   <span style={styles.episode}>{episode.episodeNum}</span>
                 </div>
                 </Link>
                )
            })}
        </div>
        <Popular/>
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