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
    //const [ videosrc, setVideosrc ] = useState('')

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

// create a download function 

function handleDownload(link, resolution, title){
    const a = document.createElement('a')
    a.href = link
    a.download = `ShonenStream-${title}-${resolution}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    console.log({link, resolution, title})
}

    return (
        <div className='container my-3'>
            {animeDetails ? (
                <div className='grid place-content-center w-full'>
                    <h2 style={styles.h2}>{animeDetails.title}</h2>
                    <div style={{ height: iframeDivSize.height, width: iframeDivSize.width, background: '#000' }} className='p-0 m-0'>
                        <Video video={animeDetails.videoSRC}/>
                    </div>
                    <div className='prev-next flex flex-row justify-between items-center p-3' style={styles.prevNext}>
                        {animeDetails.prev && <Link style={{ fontWeight: '400', color: '#ee49fd'}} to={animeDetails.prev}>Back</Link>}
                        {animeDetails.next && <Link style={{ fontWeight: '400', color: '#ee49fd'}} to={animeDetails.next}>Next</Link>}
                    </div>
                    <select style={styles.select} onChange={(e)=>{
                        const selectedIndex = e.target.selectedIndex
                        const selectedOption = animeDetails.directDownloadLink[selectedIndex]
                        handleDownload(selectedOption.link, selectedOption.resolution, animeDetails.title)
                    }}>
                        <option value="" style={styles.option} className='option'>Download <DownloadSimple/></option>
                        {animeDetails.directDownloadLink.map((data, index)=>(
                            <option value={data.resolution} key={index} style={styles.option} className='option'>
                                <span>{data.resolution} - mp4</span>
                            </option>
                        ))}
                    </select>
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
    select:{
        width: '200px',
        borderRadius: '5px',
        padding: '10px',
        border: 'none',
        outline: 'none',
        background: '#643c7d',
        color: '#eee',
        margin: '14px 0 0 10px',
        appearance: 'none',
        textAlign: 'center',
        fontFamily: 'Inter'
    },
    option: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#242424',
        color: '#643c7d'
    }
}
