import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import Err from '../Err'
import HomeSkeleton from '../Skeleton/HomeSkeleton'
import Slider from './Slider'
import { Link } from 'react-router-dom'
import Popular from '../Popular'
import { toast } from 'react-toastify'
import { Bookmark } from 'phosphor-react'

export default function Content() {

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 900
        const breakpoint2 = 600
        if(screen > breakPoint){
            return styles.bigScreen
        }else if(screen <= breakpoint2){
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
    const [ bookmark, setBookmark ] = useState([])
    const [ lastThree, setLastThree ] = useState([])
    const [ err, setErr ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const id = localStorage.getItem('currentUser')

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
                toast('If Page Refuses to Scroll, Tap or Click on the screen')
            }catch(err){
                setLoading(false)
                setErr('Something Went Wrong')
            }
        }
        fetchNewData()
    },[])

    async function getBookMarkData(){
        try {
            const book = await axios.get(`${backendUrl}api/bookmark/get?id=${id}`)
            setBookmark(book.data)
        } catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        getBookMarkData()
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

    const isBookmarked = (title) => bookmark.some((b) => b.title === title)

    async function addBookMark(title, episode, link, imgUrl){
        const payload = {}
        payload.title = title
        payload.episode = episode
        payload.link = link
        payload.imgUrl = imgUrl
        console.log(payload)
        try {
            const response = await axios.post(`${backendUrl}api/bookmark/add?id=${id}`, payload)
            toast.success(response.data.message,{
                position: 'top-right'
            })
            getBookMarkData()
        } catch(err){
            console.log('An Error Occurred',err.message)
            toast.error(err.response.data.message,{
                position: 'top-right'
            })
        }
    }

  return (
    <div className='container grid place-content-center'>
        <Slider anislide={lastThree}/>
        <h2 style={{ fontWeight: '600', color: '#643c7d', fontSize: '1.3rem', }}><strong>RECENT RELEASE</strong></h2>
        <div className="my-3" style={currentStyles}>
            {recentEpisode.map((episode, index) => {
                return (
                 <div className='relative' key={index}>
                 <Link to={`/watch${episode.link}`}>
                    <div className="w-40 h-72 lg:w-48 md:w-44 text-center relative">
                        <img style={styles.img} src={episode.imgURL} alt="" className="img-fluid" />
                        <p style={styles.title}>{episode.title}</p>
                    </div>
                 </Link>
                 <div className='w-full h-auto flex flex-row justify-between items-center p-2' style={styles.bottomCard}>
                    <span style={styles.bottomSpan}>Ep {episode.episodeNum.replace('Episode','').trim()}</span>
                    <button disabled={id ? false : true} onClick={() => addBookMark(episode.title, episode.episodeNum, episode.link, episode.imgURL)}><Bookmark size={23} weight={isBookmarked(episode.title) ? 'fill' : 'bold'} color={isBookmarked(episode.title) ? '#634c7d' : 'white'}/></button>
                 </div>
                 </div>
                )
            })}
        </div>
        <Popular/>
    </div>
  )
}

const styles = {
    bottomCard:{
        position: 'absolute',
        bottom: '43px',
        background: 'rgba(18, 18, 18, .7)',
        color: '#eee'
    },
    bottomSpan:{
        background: '#634c7d',
        color: '#eee',
        width: 'max-content',
        padding: '2px',
        borderRadius: '5px',
        margin: '0 0 2px 0'
    },
    img:{
        width: '100%',
        height: '85%',
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