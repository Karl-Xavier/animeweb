import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import { XCircle } from 'phosphor-react'
import Loader from '../Loader'
import Err from '../Err'
import HomeSkeleton from '../Skeleton/HomeSkeleton'

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

    const netErr = axios.AxiosError.ERR_NETWORK
    const wrong = axios.AxiosError.ERR_BAD_REQUEST
    const invalid = axios.AxiosError.ERR_INVALID_URL

    useEffect(()=>{
        async function fetchNewData(){
            try{
                const response = await axios.get('http://localhost:5003/api/recent')
                setRecentEpisode(response.data)
                setLoading(false)
                setErr(null)
            }catch(err){
                console.log('Error Occurred', err)
                setLoading(false)
                if(netErr){
                    setErr('No Stable Internet')
                    return
                } else if (wrong){
                    setErr('Something Went Wrong')
                } else if(invalid){
                    setErr('No Such genre')
                }
            }
        }
        fetchNewData()
    },[])

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

    console.log('hello')

  return (
    <div className='container'>
        <h3><strong>RECENT RELEASE</strong></h3>
        {/* <iframe src="https://s3taku.com/streaming.php?id=MjE5MDUx&title=Kingdom+5th+Season+%28Chinese+Name%29+Episode+1&typesub=SUB" width="800" height="450" allow="autoplay; fullscreen" allowfullscreen></iframe> */}
        <div className="my-3" style={currentStyles}>
            {recentEpisode.map((episode, index) => {
                return (
                 <div key={index} className="w-36 h-64 lg:w-48 md:w-44 text-center">
                   <img style={styles.img} src={episode.imgURL} alt="" className="img-fluid rounded-xl" />
                   <p style={styles.title}>{episode.title}</p>
                   <span style={styles.episode}>{episode.episodeNum}</span>
                 </div>
                )
            })}
        </div>
        {recentEpisode.length === 0 && (
            <p>No Recent Release</p>
        )}
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
        gap: '12px'
    },
    midScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
    },
    smScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px'
    }
}