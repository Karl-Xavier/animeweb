import React, { useEffect, useState } from 'react'
import axios from 'axios'
import NewsSkeleton from '../Skeleton/NewsSkeleton'
import Err from '../Err'
import { useNavigate } from 'react-router-dom'

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

  useEffect(()=>{
    async function fetchNews(){
      try {
        const response = await axios.get('http://localhost:5003/api/feeds')
        setNews(response.data.articles)
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
      <h2 style={{ fontWeight: '600', color: '#ee49fd', margin: '0 0 15px 0' }}>TODAY'S ANIME NEWS</h2>
      <div style={width}>
          {news.map((feed, index)=>{
            return (
            <div key={index} style={currentStyles} className='mb-5' id={feed.documentId}>
              <img src={feed.img} alt={feed.title} style={styles.image}/>
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
  background: 'linear-gradient(270deg, #ee49fd, #6167ff)',
  padding: '5px',
  borderRadius: '5px'
}
}