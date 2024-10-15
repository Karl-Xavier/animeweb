import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { DownloadSimple } from 'phosphor-react'
import Video from '../Video'
import VideoSkeleton from '../Skeleton/VideoSkeleton'

export default function Content() {
    const { epLink } = useParams()
    const [animeDetails, setAnimeDetails] = useState(null)

    function parseEpisodeLink(link) {
        if (typeof link !== 'string') {
            return { animeName: '', episodeNumber: '' }
        }
        
        const parts = link.split('-')
        const episodeNumber = parts.pop()
        const animeName = parts.join('-').replace(/-episode$/, '')
        return { animeName, episodeNumber }
    }

useEffect(() => {
    async function fetchAnimeDetails() {
        try {
            const { animeName, episodeNumber } = parseEpisodeLink(epLink)
            
            const response = await axios.get(`https://animeweb-orcin.vercel.app/api/${animeName}/${episodeNumber}`)           
            setAnimeDetails(response.data)
        } catch (err) {
            console.error('Error fetching anime details:', err)
        }
    }
    fetchAnimeDetails()
}, [epLink])

useEffect(() => {
    if(animeDetails){
        document.title = `Watch ${animeDetails.title}`
    } else {
        document.title = 'Watch, Stream and Download Anime Online'
    }
}, [animeDetails])

    return (
        <div className='container my-3'>
            {animeDetails ? (
                <div className='grid place-content-center w-full'>
                    <h2 style={styles.h2}>{animeDetails.title}</h2>
                    <Video video={animeDetails.videoSRC}/>
                    <div className='prev-next flex flex-row justify-between items-center p-3' style={styles.prevNext}>
                        {animeDetails.prev && <Link style={{ fontWeight: '400', color: '#ee49fd'}} to={animeDetails.prev}>Back</Link>}
                        {animeDetails.next && <Link style={{ fontWeight: '400', color: '#ee49fd'}} to={animeDetails.next}>Next</Link>}
                    </div>
                    <a href={animeDetails.downloadLink} target='_blank'><button style={styles.button}>Download <DownloadSimple weight='fill' size={22}/></button></a>
                </div>
            ) : (
                <VideoSkeleton/>
            )}
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
        display: 'inline-block',
        maxWidth: 'max-content'
    },
    button:{
        width: '120px',
        height: '40px',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        color: '#eee',
        background: 'linear-gradient(270deg, #ee49fd, #6167ff)',
        margin: '14px 0 0 10px'
    }
}
