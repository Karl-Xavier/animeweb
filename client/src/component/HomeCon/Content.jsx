import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import { XCircle } from 'phosphor-react'
import Loader from '../Loader'
import Err from '../Err'

export default function Content() {
    const [recentEpisode, setRecentEpisode] = useState([])
    const [ err, setErr ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const netErr = axios.AxiosError.ERR_NETWORK
    const wrong = axios.AxiosError.ERR_BAD_REQUEST
    const invalid = axios.AxiosError.ERR_INVALID_URL

    useEffect(()=>{
        async function fetchNewData(){
            try{
                const response = await axios.get('http://localhost:5003/recent')
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
            <Loader/>
        )
    }
    if(err){
        return(
            <Err err={err}/>
        )
    }

  return (
    <div className='container'>
        <h3><strong>RECENT RELEASE</strong></h3>
        <div className="row my-3">
            {recentEpisode.map((episode, index) => {
                return (
                 <div key={index} className="col-lg-3 col-md-4 col-6 mb-3 text-center">
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
    img: {
        width: '100%',
        height: '280px',
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
    }
}