import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import SmallNav from '../Nav/SmallNav'
import { MagnifyingGlass } from 'phosphor-react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {

    const location = useLocation()
    useEffect(()=>{},[location])

    const searchPage = location.pathname.startsWith('/searchpage')

  return (
    <div className='container mb-3'>
        <header style={styles.header}>
            <SmallNav/>
            <Link to={'/'}>
            <h1 style={styles.header.h1}>MyAnime_TV</h1>
            </Link>
            <Link to={'/searchpage'}>
                <MagnifyingGlass weight='bold' size={22}/>
            </Link>
        </header>
    </div>
  )
}

const styles = {
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 0 7px 0',
        h1:{
            fontWeight: '500',
            fontSize: '1.4rem',
            userSelect: 'none',
            color: '#ee49fd'
        }
    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        gap: '10px'
    }
}