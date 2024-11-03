import React, { useEffect, useState } from 'react'
import axios from 'axios'
import NewsSkeleton from '../Skeleton/NewsSkeleton'
import Err from '../Err'
import { useNavigate } from 'react-router-dom'
import backup from '../../assets/animeTvlogo.jpg'

export default function Content() {

  function getStyles(){
    const screen = window.innerWidth
    const breakPoint = 768
    if(screen > breakPoint){
            return { width:'500px', height: '400px'}
    } else if(screen < breakPoint){
        return { width: '100%', height: '280px' }
    }   
    return {width: '350px', height: '380px'
    }
  }

  function newGet(){
    const screen = window.innerWidth
    const breakPoint = 575
    if(screen > breakPoint){
      return styles.main
    }
    return styles.mainSm
  }

const [ currentStyles, setCurrentStyles ] = useState(getStyles())
const [ width, setWidth ] = useState(newGet())

useEffect(()=>{
    function handleResize(){
        setWidth(newGet())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
},[])

useEffect(()=>{
    function handleWidthSize(){
        setCurrentStyles(getStyles())
    }

    window.addEventListener('resize', handleWidthSize)
    return () => window.removeEventListener('resize', handleWidthSize)
},[])

  const [ news, setNews ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ err, setErr ] = useState(null)
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(()=>{
    async function fetchNews(){
      try {
        const response = await axios.get(`${backendUrl}api/feeds`)
        const data = response.data.articles
        const cleanedData = data.map(item => {
          // Check if `img` exists and clean it
          if (item.img) {
              // Remove query parameters from `img` URL using regex
              item.img = item.img.replace(/(\.jpe?g|\.png|\.gif|\.webp|\.svg)(\?.*)?$/i, '$1');
          }
          return item;
      })
        const filteredData = cleanedData.filter(items => items.title !== '[Removed]' && items.content !== '[Removed]')
        const slicedData = filteredData.slice(0, 50)
        setNews(slicedData)
        console.log(slicedData)
        setLoading(false)
        setErr(null)
      } catch (err) {
        setLoading(false)
        setErr('Somethng went wrong')
      }
    }

    fetchNews()
  },[])

  useEffect(() => {
    document.title = 'Anime News and Update'
}, [])

if(loading){
  return (
    <NewsSkeleton/>
  )
}

if(err){
  return(
    <Err err={err}/>
  )
}

  return (
    <div className='container grid place-content-center'>
      <h2 style={{ fontWeight: '600', color: '#eee', margin: '0 0 15px 0', fontSize: '1.3rem' }}>TODAY'S ANIME NEWS</h2>
      <div style={width}>
          {news.map((feed, index)=>{
            return (
            <div key={index} style={currentStyles} className='mb-5' id={feed.documentId}>
              <img src={feed.img ? feed.img : backup} alt={feed.title} style={styles.image}/>
              <h5 style={styles.title}>{feed.title}</h5>
              <div className="w-full flex flex-row justify-center items-center py-3">
              <a href={feed.newLink} target='_blank' style={styles.button}><button>Read More</button></a>
              </div>
            </div>)
          })}
      </div>
    </div>
  )
}

const styles = {
  main:{
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: '10px',
    placeContent: 'center'
},
mainSm:{
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(1,1fr)',
    gap: '10px',
    placeContent: 'center'
},
image:{
    width: '100%',
    height: '75%',
    borderRadius: '5px',
},
title: {
    width: '100%',
    borderRadius: '5px',
    marginTop: '13px',
    color: '#6167ff',
    fontWeight: '600',
    textAlign: 'center'
},
button:{
  width: '50%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignIyems: 'center',
  fontWeight: '600',
  background: '#643c7d',
  padding: '5px',
  borderRadius: '5px'
}
}