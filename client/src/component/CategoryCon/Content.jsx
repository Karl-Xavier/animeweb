import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import CategorySkel from '../Skeleton/CategorySkel'

export default function Content() {

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 765
        if(screen > breakPoint){
            return styles.epiBtn
        }else if(screen < breakPoint){
            return styles.epiBtnSm
        }else{
            return styles.epiBtnMid
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

    const { name } = useParams()
    const [animeInfo, setAnimeInfo] = useState(null)
    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(()=>{
        async function fetchResults(){
            try {
                const trimmedName = name.startsWith('/') ? name.substring(1) : name;
                const response = await axios.get(`${backendUrl}api/category/${trimmedName}`)
                setAnimeInfo(response.data)
            } catch (err){
                console.log('Error', err)
            }
        }
        fetchResults()
    },[name])

    useEffect(() => {
        if (animeInfo) {
          document.title = `${animeInfo.title} - Watch Now`
        } else {
            document.title = 'Watch, Stream and Download Anime Online'
        }
      }, [animeInfo])

    const beforeColon=(str)=>{
        if(!str) return ''
        return str.split(':')[0].trim()
    }
    const afterColon=(str)=>{
        if(!str) return ''
        return str.split(':')[1]?.trim()
    }
    function styleText(text){
        return(
            <strong style={styles.text}>{text}:</strong>
        )
    }

    function handleRedirect(link){
        navigate(`/watch${link}`)
    }

    if(animeInfo === null){
        return(
            <CategorySkel/>
        )
    }

  return (
    <div>
        {animeInfo && (
            <div className="container">
            <div className="row">
            <div className="col-lg-5 col-md-5">
                <img src={animeInfo.imgURL} style={styles.image} className='h-40 md:h-48 lg:h-96 img-fluid'/>
            </div>
            <div className="col-lg-7 col-md-7">
                <h2 style={styles.animeTitle}>{animeInfo.title}</h2>
                <h4><strong style={styles.summ}>SUMMARY: </strong><p style={styles.desc}>{animeInfo.description}</p></h4>
                <p style={styles.namePa}>
                    <span style={styles.first}>
                        {styleText(beforeColon(animeInfo.names[2]))} 
                    </span> &nbsp;
                    <span style={styles.second}>
                        {afterColon(animeInfo.names[2])}
                    </span>
                </p>
                <p style={styles.namePa}>
                    <span style={styles.first}>
                        {styleText(beforeColon(animeInfo.names[3]))} 
                    </span> &nbsp;
                    <span style={styles.second}>
                        {afterColon(animeInfo.names[3])}
                    </span>
                </p>
                <p style={styles.namePa}>
                    <span style={styles.first}>
                        {styleText(beforeColon(animeInfo.names[0]))} 
                    </span> &nbsp;
                    <span style={styles.second}>
                        {afterColon(animeInfo.names[0])}
                    </span>
                </p>
                <p style={styles.namePa}>
                    <span style={styles.first}>
                        {styleText(beforeColon(animeInfo.names[4]))} 
                    </span> &nbsp;
                    <span style={styles.second}>
                        {afterColon(animeInfo.names[4])}
                    </span>
                </p>
                <p style={styles.namePa}>
                    <span style={styles.first}>
                        {styleText(beforeColon(animeInfo.names[5]))} 
                    </span> &nbsp;
                    <span style={styles.second}>
                        {afterColon(animeInfo.names[5])}
                    </span>
                </p>
            </div>
        </div>
        <div className='my-3'>
            <h3 style={styles.episodeHeader}>Available Episodes</h3>
            <div style={styles.buttonDiv}>
                {animeInfo.episodes && animeInfo.episodes.length > 0 && animeInfo.episodes.map((episode, index) => (
                    <button style={{...currentStyles, fontFamily: 'Inter'}} key={index} onClick={() => handleRedirect(episode.epLink)}>
                        {episode.epNum}
                    </button>
                ))}
            </div>
        </div>
        </div>
        )}
    </div>
  )
}

const styles = {
    image: {
        width: '100%',
        objectFit: 'contain',
        height: ''
    },
    text:{
        color: '#6167ff'
    },
    animeTitle: {
        background: '#e0e0e0',
        color: '#6167ff',
        fontWeight: '500',
        fontSize: '1.2rem',
        margin: '5px 0 5px 0',
        padding: '5px',
        borderRadius: '5px',
        display: 'inline-block'
    },
    summ: {
        color: '#6167ff',
        textDecoration: 'underline',
        margin: '0 0 2px 0'
    },
    desc: {
        lineHeight: '1.4',
        fontWeight: '600'
    },
    namePa: {
        margin: '5px 0 5px 0'
    },
    first: {
        color: '#6167ff',
        fontWeight: '600'
    },
    second: {
        fontWeight: '600'
    },
    epiBtn: {
        background: '#643c7d',
        width: '100px',
        height: '40px',
        padding: '5px',
        margin: '5px',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    epiBtnMid:{
        background: '#643c7d',
        width: '110px',
        height: '40px',
        padding: '5px',
        margin: '5px',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    epiBtnSm:{
        background: '#643c7d',
        width: '95px',
        height: '40px',
        padding: '5px',
        margin: '2px',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    episodeHeader: {
        fontSize: '1.4rem',
        fontWeight: 'bold'
    }
}