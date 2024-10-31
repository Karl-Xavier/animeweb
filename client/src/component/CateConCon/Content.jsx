import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { DownloadSimple } from 'phosphor-react'
import Video from '../Video'
import VideoSkeleton from '../Skeleton/VideoSkeleton'

export default function Content() {

    const [iframeDivSize, setIframeDivSize] = useState({ width: 800, height: 450 });

    useEffect(() => {
      function updateIframeSize() {
        const windowWidth = window.innerWidth;
  
        let width, height;
        if (windowWidth < 768) {
          width = windowWidth - 40
          height = 300
        } else if (windowWidth < 1200) {
          width = 700
          height = 450
        } else {
          width = 980
          height = 570
        }
  
        setIframeDivSize({ width, height });
      }
  
      updateIframeSize(); // Set initial size
      window.addEventListener('resize', updateIframeSize); // Adjust on resize
  
      return () => window.removeEventListener('resize', updateIframeSize);
    }, [])
  
    const { epLink } = useParams()
    const [animeDetails, setAnimeDetails] = useState(null)
    const [ isShown, setIsShown ] = useState(false)

    function parseEpisodeLink(link) {
        if (typeof link !== 'string') {
            return { animeName: '', episodeNumber: '' }
        }
        
        const parts = link.split('-')
        const episodeNumber = parts.pop()
        const animeName = parts.join('-').replace(/-episode$/, '')
        return { animeName, episodeNumber }
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL

useEffect(() => {
    async function fetchAnimeDetails() {
        try {
            const { animeName, episodeNumber } = parseEpisodeLink(epLink)
            
            const response = await axios.get(`${backendUrl}api/${animeName}/${episodeNumber}`)
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

function toggleText(){
    setIsShown(!isShown)
}

if(animeDetails === null){
    return(
        <VideoSkeleton/>
    )
}

return (
    <div className='container my-3'>
        {animeDetails && (
            <div className='grid place-content-center w-full'>
                <h2 style={styles.h2}>{animeDetails.title}</h2>
                <div style={{ height: iframeDivSize.height, width: iframeDivSize.width}} className='p-0 mb-2 grid place-content-center'>
                    <Video hsl={animeDetails.hlsUrl} download={animeDetails.downloadLink}/>
                </div>
                <div className='prev-next flex flex-row justify-between items-center p-3 my-3' style={styles.prevNext}>
                    {animeDetails.prev && <Link style={{ fontWeight: '400', color: '#ee49fd'}} to={`/watch${animeDetails.prev}`}>Back</Link>}
                    {animeDetails.next && <Link style={{ fontWeight: '400', color: '#ee49fd'}} to={`/watch${animeDetails.next}`}>Next</Link>}
                </div>
                <button onClick={toggleText} style={styles.button}>{!isShown ? 'Show Download Option' : 'Close Download Option'}</button>
                {isShown && (
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 my-3'>
                    {animeDetails.directDownloadLink.map((download, index)=>(
                        <div style={styles.dCard}>
                            <h3>Title:&nbsp;<span style={{ color: '#242424' }}>{animeDetails.title}</span></h3>
                            <p>Resolution:&nbsp;<span style={{ color: '#242424' }}>{download.resolution}</span></p>
                            <p>Provider: <span style={{ color: '#242424' }}>Gogoanime</span></p>
                            <a href={download.link} download><button style={styles.dbutton}>Download <DownloadSimple weight='fill' size={22}/></button></a>
                        </div>
                    ))}
                </div>
                )}
            </div>
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
        width: 'max-content',
        height: '40px',
        borderRadius: '5px',
        outline: 'none',
        background: '#643c7d',
        color: '#eee',
        padding: '5px'
    },
    dCard:{
        background: '#eee',
        color: '#634c7d',
        borderRadius: '5px',
        padding: '5px',
        fontWeight: 'bold'
    },
    dbutton:{
        width: '100%',
        height: '40px',
        borderRadius: '5px',
        outline: 'none',
        background: '#643c7d',
        color: '#eee',
        padding: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}
