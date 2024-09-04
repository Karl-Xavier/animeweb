import React, { useEffect } from 'react'
import { CalendarCheck, House, List, MagnifyingGlass, Star, FilmSlate, X, } from 'phosphor-react'
import { Link, useLocation } from 'react-router-dom'
import SearchBar from '../Search/SearchBar'

export default function SideNav({ isNavOpen, toggleSlider, setIsNavOpen }) {
  const location = useLocation()
  useEffect(()=>{},[location])

  const homeRoute = location.pathname === '/'
  const popularRoute = location.pathname.startsWith('/popular')
  const newRoute = location.pathname.startsWith('/newseason')
  const movieRoute = location.pathname.startsWith('/movies')

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
                  <li style={{...styles.li, background: homeRoute ? "#f9f9f9" : 'transparent', color: homeRoute ? '#242424' : 'inherit'}}>
                    <Link style={styles.link} to={'/'}>Home <House size={24} weight='fill'/></Link>
                  </li>
                  <li style={{...styles.li, background: popularRoute ? '#f9f9f9' : 'transparent', color: popularRoute ? '#242424' : 'inherit'}} >
                    <Link style={styles.link} to={'/popular'}>Popular <Star size={24} weight='fill'/></Link>
                  </li>
                  <li style={{...styles.li, background: newRoute ? '#f9f9f9' : 'transparent', color: newRoute ? '#242424' : 'inherit'}}>
                    <Link style={styles.link} to={'/newseason'}>New Release <CalendarCheck size={24} weight='fill'/></Link>
                  </li>
                  <li style={{...styles.li, background: movieRoute ? '#f9f9f9' : 'transparent', color: movieRoute ? '#242424' : 'inherit'}}>
                    <Link style={styles.link} to={'/movies'}>Movies <FilmSlate size={24} weight='fill'/></Link>
                  </li>
                </ul>
            </div>
        ) : (
            <div>
              <ul style={styles.ul}>
                <li style={styles.icon} onClick={showNav}><MagnifyingGlass weight='bold' size={24}/></li>
                <li style={{...styles.icon, color: homeRoute ? '#242424' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/'}><House size={24} weight='fill'/></Link>
                </li>
                <li style={{...styles.icon, color: popularRoute ? '#242424' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/popular'}><Star size={24} weight='fill'/></Link>
                </li>
                <li style={{...styles.icon, color: newRoute ? '#242424' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/newseason'}><CalendarCheck size={24} weight='fill'/></Link>
                </li>
                <li style={{...styles.icon, color: movieRoute ? '#242424' : 'inherit'}}>
                  <Link style={styles.iconLink} to={'/movies'}><FilmSlate size={24} weight='fill'/></Link>
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
    background: 'linear-gradient(270deg, #ee49fd, #6167ff)',
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
    background: 'linear-gradient(270deg, #ee49fd, #6167ff)',
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
}