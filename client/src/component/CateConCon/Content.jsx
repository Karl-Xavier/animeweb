import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { DownloadSimple } from 'phosphor-react'

export default function Content() {
    const { episode } = useParams()
    const [ animeDetails, setAnimeDetails ] = useState(null)
    // Media Query //
        function getStyles() {
            const screen = window.innerWidth
            const breakpoint = 600
            if(screen > breakpoint){
                return styles.videoLarge
            }
            return styles.video
        }
        const [currentStyles, setCurrentStyles] = useState(getStyles())
        useEffect(()=>{
            function handleResize(){
                setCurrentStyles(getStyles())
            }
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        },[])
    // End //

    useEffect(()=>{
        async function fetchAnimeDetails(){
            try{
                const response = await axios.get(`http://localhost:5003/${episode}`)
                setAnimeDetails(response.data)
                console.log(response.data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchAnimeDetails()
    },[episode])
    console.log(`http://localhost:5003/${episode}`)

  return (
    <div className='container my-3'>
        <h2 style={styles.h2}>Demon Slayer</h2>
        <video controls style={currentStyles}>
            <source src="https://s3taku.com/abpl1245?id=NjQxNzE=&title=Overlord+Episode+2&typesub=SUB" type="video/mp4"/>
        </video>
        <div className='prev-next' style={styles.prevNext}>
            <Link>Back To Episode 1</Link>
            <Link>Go To Episode 2</Link>
        </div>
        <section style={styles.downloadDiv} className="download">
            <header style={{
                margin: '0 0 10px 0',
                fontWeight : '500',
                fontSize: '1.2rem'
            }}>
                <h3>Available Links</h3>
            </header>
            <button style={styles.downloadBtn}>640 X 360<DownloadSimple weight='fill' size={24}/></button>
            <button style={styles.downloadBtn}>850 X 480<DownloadSimple weight='fill' size={24}/></button>
            <button style={styles.downloadBtn}>1020 X 720<DownloadSimple weight='fill' size={24}/></button>
            <button style={styles.downloadBtn}>1920 X 1080<DownloadSimple weight='fill' size={24}/></button>
        </section>
    </div>
  )
}

const styles = {
    h2: {
        fontWeight: 600,
        fontSize: '1.4rem',
        color: '#6167ff',
        background: '#e0e0e0',
        padding: '5px',
        borderRadius: '5px',
        margin: '0 0 10px 0',
        display: 'inline-block'
    },
    video: {
        width: '100%',
        height: '220px',
        margin: '0 0 10px 0'
    },
    videoLarge: {
        width: '100%',
        height: '400px',
        margin: '0 0 10px 0'
    },
    prevNext: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px',
        color: '#6167ff',
        textDecoration: 'underline',
        margin: '0 0 10px 0'
    },
    downloadDiv: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    downloadBtn: {
        width: '60%', 
        background: 'linear-gradient(270deg,#6167ff,#ee49fd)',
        margin: '0 0 10px 0',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px'
    }
}