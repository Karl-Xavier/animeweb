import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { MagnifyingGlass } from 'phosphor-react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Content() {

    const [ searchQuery, setSearchQuery ] = useState('')
    const [ animeRes, setAnimeRes ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ err, setErr ] = useState(null)

    async function handleSearch(e){
        e.preventDefault()
        try{
            const response = await axios.get(`http://localhost:5003/search/${searchQuery}`)
            setLoading(false)
            setAnimeRes(response.data)
            console.log(response.data)
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
        {searchQuery !== '' && (
            <h3 className='my-3'>Your Results for {searchQuery}</h3>
        )}
        <div className='row'>
            {animeRes.map((anime, index)=>{
                return (
                <div key={index} className="col-lg-3 col-md-4 col-6 text-center">
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