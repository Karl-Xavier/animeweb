import React, { useEffect, useState } from 'react'
import { House, List, MagnifyingGlass, FilmSlate, X, Newspaper, } from 'phosphor-react'
import { Link, useLocation } from 'react-router-dom'
import SearchBar from '../Search/SearchBar'
import axios from 'axios'
import avatar from '../../assets/avatar.jpg'

export default function SideNav({ isNavOpen, toggleSlider, setIsNavOpen }) {
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

  function showNav(){
    setIsNavOpen(!isNavOpen)
  }
  return (
    <div style={!isNavOpen ? styles.siderbarOpen : styles.sidebarClosed}>
        <div style={styles.clop}>
          <button type='button' style={styles.closeopen} onClick={toggleSlider}>{isNavOpen ? <List size={24} weight='fill'/> : <X size={24} weight='fill'/>}</button>
        </div>
        {!isNavOpen ? (
            <div style={styles.contentContainer}>
                <SearchBar/>
                <ul style={styles.ul}>
                  <li style={styles.li}>
                    {currentUser ? (
                      <Link style={{...styles.link, justifyContent: 'flex-start', gap: '10px'}} to={`/profile?id=${currentUser.userId}&username=${currentUser.username}`}>
                        <img src={currentUser.profileImg === '' ? avatar : currentUser.profileImg} alt='You' style={styles.profile}/>
                        <span style={{ maxWidth: '75%', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentUser.username}</span>
                      </Link>
                    ):(
                      <p style={styles.link}>
                      <img src={avatar} alt='You' style={styles.profile}/>
                      <Link to={'/register'}>Register</Link> | <Link to={'/login'}>Login</Link>
                      </p>
                    )}
                  </li>
                  <li style={{...styles.li, background: homeRoute ? "#f9f9f9" : 'transparent', color: homeRoute ? '#242424' : 'inherit'}}>
                    <Link style={styles.link} to={'/'}>Home <House size={24} weight='fill'/></Link>
                  </li>
                  <li style={{...styles.li, background: movieRoute ? '#f9f9f9' : 'transparent', color: movieRoute ? '#242424' : 'inherit'}}>
                    <Link style={styles.link} to={'/movies'}>Movies <FilmSlate size={24} weight='fill'/></Link>
                  </li>
                  <li style={{...styles.li, background: newRoute ? '#f9f9f9' : 'transparent', color: newRoute ? '#242424' : 'inherit'}}>
                    <Link style={styles.link} to={'/feed'}>News <Newspaper size={24} weight='fill'/></Link>
                  </li>
                </ul>
            </div>
        ) : (
            <div>
              <ul style={styles.ul}>
                <li style={styles.icon} onClick={showNav}><MagnifyingGlass weight='bold' size={24}/></li>
                <li style={styles.icon}>
                  {currentUser ? (
                    <Link style={styles.iconLink} to={`/profile?id=${currentUser.userId}&username=${currentUser.username}`}>
                  <img src={currentUser.profileImg === '' ? avatar : currentUser.profileImg} alt="You" style={{...styles.profile, width: '30px', height: '30px'}}/>
                  </Link>):(
                    <p style={styles.iconLink}>
                    <img src={avatar} alt="You" style={{...styles.profile, width: '30px', height: '30px'}}/>
                    </p>
                  )}
                </li>
                <li style={{...styles.icon, color: homeRoute ? '#ee49fd' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/'}><House size={24} weight='fill'/></Link>
                </li>
                <li style={{...styles.icon, color: movieRoute ? '#ee49fd' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/movies'}><FilmSlate size={24} weight='fill'/></Link>
                </li>
                <li style={{...styles.icon, color: newRoute ? '#ee49fd' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/feed'}><Newspaper size={24} weight='fill'/></Link>
                </li>
              </ul>
            </div>
        )}
    </div>
  )
}

const styles = {
  siderbarOpen: {
    width: '240px',
    height: '100%',
    transition: 'width 0.3s ease',
    background: '#242424',
    color: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px'
  },
  sidebarClosed: {
    width: '50px',
    height: '100%',
    transition: 'width 0.3s ease',
    background: '#242424',
    color: '#f0ffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px'
 },
 contentContainer: {
    width: '100%'
 },
 ul: {
  width: '100%',
  padding: 0,
  listStyle: 'none',
  margin: '10px 0 0 0'
 },
 clop: {
  width: '100%',
  display: 'grid',
  margin: '7px 0',
 },
 closeopen: {
  justifySelf: 'flex-end',
  outline: 'none'
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
 iconLink: {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
},
icon: {
  width: '100%',
  marginBottom: '23px',
},
profile:{
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  objectFit: 'cover'
}

}