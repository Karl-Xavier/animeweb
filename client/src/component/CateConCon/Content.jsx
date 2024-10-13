import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { DownloadSimple } from 'phosphor-react';
import Video from '../Video';

export default function Content() {
    const { epLink } = useParams(); // Get the full episode link from params
    const [animeDetails, setAnimeDetails] = useState(null);

    // Function to extract anime name and episode number
    function parseEpisodeLink(link) {
        if (typeof link !== 'string') {
            console.error('Link is not a string:', link);
            return { animeName: '', episodeNumber: '' }; // Return default values or handle error
        }
        
        const parts = link.split('-');
        const episodeNumber = parts.pop(); // Get the last part as the episode number
        const animeName = parts.join('-').replace(/-episode$/, ''); // Join the remaining parts back into the anime name
        return { animeName, episodeNumber };
    }

// Fetch anime details
useEffect(() => {
    async function fetchAnimeDetails() {
        try {
            const { animeName, episodeNumber } = parseEpisodeLink(epLink);
            
            // Construct the API URL correctly
            const response = await axios.get(`http://localhost:5003/api/${animeName}/${episodeNumber}`);
            
            setAnimeDetails(response.data);
            console.log(response.data);
            console.log(`http://localhost:5003/api/${animeName}/${episodeNumber}`);
        } catch (err) {
            console.error('Error fetching anime details:', err);
        }
    }
    fetchAnimeDetails();
}, [epLink])

function handleEpisodeClick(link) {
    navigate(`/episode/${link}`); // Navigate to the new episode page
}

    return (
        <div className='container my-3'>
            {animeDetails ? (
                <div className='grid place-content-center w-full'>
                    <h2 style={styles.h2}>{animeDetails.title}</h2>
                    {/* <iframe src={animeDetails.videoSRC} allowfullscreen></iframe> */}
                    <Video video={animeDetails.videoSRC}/>
                    <div className='prev-next' style={styles.prevNext}>
                        {animeDetails.prev && <Link to={animeDetails.prev}>Back</Link>}
                        {animeDetails.next && <Link to={animeDetails.next}>Next</Link>}
                    </div>
                    {/* <section style={styles.downloadDiv} className="download">
                        <header style={{ margin: '0 0 10px 0', fontWeight: '500', fontSize: '1.2rem' }}>
                            <h3>Available Links</h3>
                        </header>
                        <a href={animeDetails.downloadLinks[0].url} download>
                        <button style={styles.downloadBtn}>640 X 360<DownloadSimple weight='fill' size={24}/></button>
                        </a>
                        <button style={styles.downloadBtn}>850 X 480<DownloadSimple weight='fill' size={24}/></button>
                        <button style={styles.downloadBtn}>1020 X 720<DownloadSimple weight='fill' size={24}/></button>
                        <button style={styles.downloadBtn}>1920 X 1080<DownloadSimple weight='fill' size={24}/></button>
                    </section> */}
                    <a href={animeDetails.downloadLink}>Download</a>
                </div>
            ) : (
                <div>Loading....</div>
            )}
        </div>
    );
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
    // Add other styles...
};
