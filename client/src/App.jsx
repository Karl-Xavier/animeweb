import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import Footer from './component/Footer/Footer'
import NotFound from './pages/NotFound'
import { track } from '@vercel/analytics'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Verify from './component/AuthCon/Verify'
import Confirm from './component/AuthCon/Confirm'
import Profile from './pages/Profile/Profile'
import EditProfile from './component/ProfileCon/EditProfile'

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [ currentUser, setCurrentUser ] = useState(null)

  const location = useLocation()

  function toggleNavVisibility(){
    setIsNavOpen(!isNavOpen)
  }

  useEffect(()=>{ track(location.pathname) },[location])
  useEffect(()=>{
    const current = localStorage.getItem('currentUser')
    if(current && current !== undefined){
      setCurrentUser(current)
    }
  },[])
  

  const regRoute = location.pathname.startsWith('/register')
  const loginRoute = location.pathname.startsWith('/login')
  const verifyRoute = location.pathname.startsWith('/verify')
  const confirmationRoute = location.pathname.startsWith('/confirmation')

  return (
    <div className='mainCol w-full h-dvh' style={styles.container}>
      <ToastContainer theme='dark'/>
      {!(regRoute || loginRoute || confirmationRoute || verifyRoute) && (<div className="hidden md:hidden lg:block">
        <SideNav  isNavOpen={isNavOpen} toggleSlider={toggleNavVisibility} setIsNavOpen={setIsNavOpen}/>
      </div>)}
      <div style={isNavOpen ? styles.mainContentClosed: styles.mainContentOpen} className='container'>
       {!(regRoute || loginRoute || confirmationRoute || verifyRoute) && <Header/>}
        <div className='min-h-full'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={currentUser ? <Navigate to={'/'}/> : <Register/>}/>
            <Route path='/login' element={currentUser ? <Navigate to={'/'}/> : <Login/>}/>
            <Route path='/verify' element={currentUser ? <Navigate to={'/'}/> : <Verify/>}/>
            <Route path='/confirmation' element={currentUser ? <Navigate to={'/'}/> : <Confirm/>}/>
            <Route path='/profile' element={!currentUser ? <Navigate to={'/'}/> : <Profile/>}/>
            <Route path='/edit' element={!currentUser ? <Navigate to={'/'}/> : <EditProfile/>}/>
            <Route path='/movies' element={<Movie/>}/>
            <Route path='/genre/:genre' element={<GenreResult/>}/>
            <Route path='/category/:name' element={<Category/>}/>
            <Route path='/searchpage' element={<SearchPage/>}/>
            <Route path='/watch/:epLink' element={<CateCon/>}/>
            <Route path='/feed' element={<News/>}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
        {!(regRoute || loginRoute || confirmationRoute || verifyRoute) && <Footer/>}
      </div>
    </div>
  )
}

export default App

const styles = {
  container: {
    display: 'flex',
    fontFamily: 'Poppins'
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