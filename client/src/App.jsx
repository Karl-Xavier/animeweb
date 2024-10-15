import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import Header from './component/Header/Header'
import SideNav from './component/Nav/SideNav'
import Home from './pages/Home/Home'
import Movie from './pages/Movie/Movie'
import GenreResult from './pages/GenreResult/GenreResult'
import Category from './pages/Category/Category'
import SearchPage from './pages/SearchPage/SearchPage'
import CateCon from './pages/CateCon/CateCon'
import News from './pages/News/News'
import Err from './pages/404'
import Adsense from './component/Adsense'

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  function toggleNavVisibility(){
    setIsNavOpen(!isNavOpen)
  }

  return (
    <div className='mainCol w-full h-dvh' style={styles.container}>
      <div className="hidden md:hidden lg:block">
        <SideNav  isNavOpen={isNavOpen} toggleSlider={toggleNavVisibility} setIsNavOpen={setIsNavOpen}/>
      </div>
      <div style={isNavOpen ? styles.mainContentOpen : styles.mainContentClosed} className='container'>
        <Header/>
        <div>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/movies' element={<Movie/>}/>
            <Route path='/genre/:genre' element={<GenreResult/>}/>
            <Route path='/category/:name' element={<Category/>}/>
            <Route path='/searchpage' element={<SearchPage/>}/>
            <Route path='/:epLink' element={<CateCon/>}/>
            <Route path='/feed' element={<News/>}/>
            <Route path='/*' element={<Err/>}/>
          </Routes>
          <Adsense/>
        </div>
      </div>
    </div>
  )
}

export default App

const styles = {
  container: {
    display: 'flex',
  },
  mainContentOpen: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    overflowY: 'scroll',
  },
  mainContentClosed: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    overflowY: 'scroll',
  },
}