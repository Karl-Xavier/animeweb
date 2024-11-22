import { FilmSlate, House, List, Newspaper, X } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import SearchBar from '../Search/SearchBar'
import { Link, useLocation } from 'react-router-dom'
import avatar from '../../assets/avatar.jpg'
import axios from 'axios'

export default function SmallNav() {
  const [ isNavOpen, setIsNavOpen ] = useState(false)
  const [ isExpanded, setIsExpanded ] = useState(false)

  const location = useLocation()
  useEffect(()=>{},[location])

  const homeRoute = location.pathname === '/'
  const newRoute = location.pathname.startsWith('/feed')
  const movieRoute = location.pathname.startsWith('/movies')

  const [ currentUser, setCurrentUser ] = useState(null)

  useEffect(()=>{
    const current = localStorage.getItem('currentUser')

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    async function fetchCurrentUser(){
      try {
        const response = await axios.get(`${backendUrl}api/info/user?id=${current}`)
        setCurrentUser(response.data)
      } catch(err){
        console.log('An error Occurred', err)
      }
    }
    fetchCurrentUser()

  },[])

  function toggleNavVisibility(){
    setIsNavOpen(!isNavOpen)
  }
  function handleExpand(){
    setIsExpanded(true)
  }

  const styles = {
    sidebaropen: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100dvh',
      width: !isExpanded ? '100%' : '100%',
      background: '#242424',
      overflowX: 'hidden',/* 
      transform: 'translateX(-260px)', */
      transition: 'width 0.3s ease', 
      zIndex: 10,
      padding: '0 10px 0 10px'
    },
    sidebarclosed: {
      width: 0,
      transition: 'width, .3s ease-in-ou'
    },
    expandbtn: {
      outline: 'none',
      float: 'right',
      margin: '10px 0 10px 0'
    },
    btn: { outline: 'none', },
    ul: {
      width: '100%',
      padding: 0,
      listStyle: 'none',
      margin: '10px 0 0 0'
     },
    li: {
      width: '100%',
      margin: '0 0 10px 0',
      fontWeight: '600'
     },
     link: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'inherit',
      padding: '10px',
     },
     profile:{
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }

  return (
    <div className='lg:hidden'>
       <button style={styles.btn} onClick={toggleNavVisibility}>{!isNavOpen ? <List size={24} weight='bold'/> : <X size={24} weight='bold'/>}</button>
       {isNavOpen && (
        <div className='container' style={isNavOpen ? styles.sidebaropen : styles.sidebarclosed}>
          <button style={styles.expandbtn} onClick={()=> setIsNavOpen(false)}><X size={24} weight='bold'/></button>
          <SearchBar handleExpand={handleExpand} setIsExpanded={setIsExpanded} setIsNavOpen={setIsNavOpen}/>
          <ul style={styles.ul}>
              <li style={styles.li} onClick={()=>{
                setIsNavOpen(false)
                setIsExpanded(false)
                }}>
                {currentUser ? (
                  <Link style={{...styles.link, justifyContent: 'flex-start', gap: '10px'}} to={`/profile?id=${currentUser.userId}&username=${currentUser.username}`}>
                    <img src={currentUser.profileImg === '' ? avatar : currentUser.profileImg} alt='You' style={styles.profile}/>
                    <span style={{ maxWidth: '75%', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentUser.username}</span>
                  </Link>
                ):(
                  <p style={{...styles.link, width: '70%'}}>
                  <img src={avatar} alt='You' style={styles.profile}/>
                  <Link to={'/register'}>Register</Link> | <Link to={'/login'}>Login</Link>
                  </p>
                )}
              </li>
              <li onClick={()=>{
                setIsNavOpen(false)
                setIsExpanded(false)
                }} style={{...styles.li, background: homeRoute ? "#f9f9f9" : 'transparent', color: homeRoute ? '#242424' : 'inherit'}}>
                <Link style={styles.link} to={'/'}>Home <House size={24} weight='fill'/></Link>
              </li>
              <li onClick={()=>{
                setIsNavOpen(false)
                setIsExpanded(false)
                }} style={{...styles.li, background: movieRoute ? '#f9f9f9' : 'transparent', color: movieRoute ? '#242424' : 'inherit'}}>
                <Link style={styles.link} to={'/movies'}>Movies <FilmSlate size={24} weight='fill'/></Link>
              </li>
              <li onClick={()=>{
                setIsNavOpen(false)
                setIsExpanded(false)
                }} style={{...styles.li, background: newRoute ? '#f9f9f9' : 'transparent', color: newRoute ? '#242424' : 'inherit'}}>
                <Link style={styles.link} to={'/feed'}>News <Newspaper size={24} weight='fill'/></Link>
              </li>
          </ul>
        </div>
       )}
    </div>
  )
}