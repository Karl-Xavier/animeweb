import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { MagnifyingGlass } from 'phosphor-react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import HomeSkeleton from '../Skeleton/HomeSkeleton'
import Err from '../Err'
import Suggestions from '../suggestions'

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

    const [ searchQuery, setSearchQuery ] = useState('')
    const [ animeRes, setAnimeRes ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ err, setErr ] = useState(null)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    async function handleSearch(e){
        e.preventDefault()
        try{
            setLoading(true)
            const response = await axios.get(`${backendUrl}search/${searchQuery}`)
            setLoading(false)
            setAnimeRes(response.data)
        } catch(err){
            console.log('Error',err)
            setLoading(false)
            setErr('Something went wrong')
        }
    }

  return (
    <div className='container'>
        <form onSubmit={handleSearch} style={styles.form}>
            <input style={styles.input} type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder='Anime Name... e.g Naruto'/>
            <button style={styles.cta}><MagnifyingGlass weight='bold' size={24}/></button>
        </form>
        <Suggestions query={searchQuery} animeRes={animeRes} animeload={loading}/>
        {animeRes.length > 0 && (
            <h3 className='my-3' style={{ fontWeight: '600', color: '#643c7d' }}>Your Results for {searchQuery}</h3>
        )}
        <div className='container grid place-content-center'>
        <div className='my-3' style={currentStyles}>
        {animeRes.map((anime, index)=>{
             return (
                <div key={index} className="w-40 h-72 lg:w-48 md:w-44 text-center">
                    <Link to={anime.link}>
                        <img src={anime.imgURL} alt={anime.title} className='img-fluid' style={styles.img}/>
                        <h3 style={styles.title}>{anime.title}</h3>
                        <p style={styles.episode}>{anime.released}</p>
                    </Link>
                 </div>
                )
        })}
        </div>
        </div>
        {loading && (
            <HomeSkeleton/>
        )}
        {err && (
            <Err err={err}/>
        )}
    </div>
  )
}

const styles = {
    form: {
        width: '100%',
        height: '40px',
        padding: '10px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        background: '#e0e0e0',
        opacity: 1,
        color: '#242424'
    },
    input: {
        width: '100%',
        background: 'transparent',
        outline: 'none'
    },
    cta: {
        outline: 'none'
    },
    img: {
        width: '100%',
        height: '75%',
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
        margin: '8px 0 8px 0'
    },
    midScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        margin: '8px 0 8px 0'
    },
    smScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        margin: '8px 0 8px 0'
    }
}