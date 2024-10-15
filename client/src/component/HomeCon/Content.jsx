import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import Err from '../Err'
import HomeSkeleton from '../Skeleton/HomeSkeleton'
import { Link } from 'react-router-dom'

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
    const [ err, setErr ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(()=>{
        async function fetchNewData(){
            try{
                const response = await axios.get('https://animeweb-orcin.vercel.app/api/recent')
                setRecentEpisode(response.data)
                setLoading(false)
                setErr(null)
            }catch(err){
                setLoading(false)
                setErr('Something Went Wrong')
            }
        }
        fetchNewData()
    },[])

    useEffect(() => {
          document.title = 'Watch, Stream and Download Anime Online'
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
        <h3 style={{ fontWeight: '600', color: '#ee49fd' }}><strong>RECENT RELEASE</strong></h3>
        <div className="my-3" style={currentStyles}>
            {recentEpisode.map((episode, index) => {
                return (
                 <Link to={episode.link} key={index}>
                    <div className="w-40 h-64 lg:w-48 md:w-44 text-center">
                   <img style={styles.img} src={episode.imgURL} alt="" className="img-fluid rounded-xl" />
                   <p style={styles.title}>{episode.title}</p>
                   <span style={styles.episode}>{episode.episodeNum}</span>
                 </div>
                 </Link>
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
        borderRadius: '5px',
        objectFit: 'cover'
    },
    episode: {
        textAlign: 'center',
        fontWeight: '500',
    },
    title: {
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        color: '#6167ff',
        fontWeight: '600'
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