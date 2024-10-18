import axios from 'axios'
import React, { useEffect, useState } from 'react'
import fof from '../assets/404.jpg' 
import { Link } from 'react-router-dom'
import Loader from './Loader'
import Err from './Err'

export default function Suggestions({ query }) {

    function getStyles(){
        const screen = window.innerWidth
        const breakpoint = 1200
        if(screen > breakpoint){
            return styles.large
        }
        return styles.small
    }

    const [ currentWidth, setCurrentWidth ] = useState(getStyles())

    useEffect(()=>{
        function handleResize(){
            setCurrentWidth(getStyles())
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    },[])

    const [ suggestions, setSuggestions ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ err, setErr ] = useState(null)

    async function fetchSuggestions(input){
        if(input.length < 1) return
        try {
            setLoading(true)
            const res = await axios.get(`https://animeweb-orcin.vercel.app/search/${input}`)
            setLoading(false)
            setErr(null)
            const data = res.data
            console.log(data)
            setSuggestions(data)
        } catch (err){
            console.log('err', err)
            setLoading(false)
            setErr('No Result Found')
        }
    }

    useEffect(()=>{
        if(query){
            fetchSuggestions(query)
        }else {
            setSuggestions([])
        }
    },[query])

  return (
    <div className='w-full'>
        <div style={suggestions.length === 0 ? {} : currentWidth}>
            <ul style={styles.ul}>
            {suggestions.map((anisuge, index)=>{
                    return <Link to={anisuge.link} key={index}>
                        <li style={styles.li}>
                        <img src={anisuge.imgURL} alt="" style={styles.liImg}/>
                        <span>{anisuge.title}</span>
                        </li>
                    </Link>
            })}
            {loading && (
                <li style={styles.loaderli}>
                    <Loader /> {/* Display loader here */}
                </li>
            )}
            {suggestions.length === 0 && <Err message={err} />}
        </ul>
        </div>
    </div>
  )
}

const styles = {
    small:{
        width: '100%',
        border: '1px solid whitesmoke',
        borderBottom: 'none',
        borderRadius: '5px',
        background: '#2a2a3d',
        maxHeight: '400px',
        overflowY: 'scroll'
    },
    large:{
        width: '70%',
        border: '1px solid whitesmoke',
        borderRadius: '5px',
        borderBottom: 'none',
        background: '#2a2a3d',
        maxHeight: '500px',
        overflowY: 'scroll'
    },
    ul:{
        width: '100%'
    },
    li:{
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid whitesmoke',
        margin: '0 0 5px 0',
        padding: '5px'
    },
    liImg:{
        width: '50px',
        height: '50px'
    },
    span:{
        maxWidth: '75%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    loaderli:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
}