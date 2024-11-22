import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.jpg'
import { CircleWavyCheck, XCircle } from 'phosphor-react'
import { toast } from 'react-toastify'
import Bookmark from './Bookmark'

export default function Content() {

  const [ userInfo, setUserInfo ] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  useEffect(()=>{
    async function getUserInfo(){
      try {
        const response = await axios.get(`${backendUrl}api/info/user?id=${id}`)
        setUserInfo(response.data)
        document.title = `${response.data.username} Profile | Shonenestream`
      } catch (error) {
        console.log(error.message)
      }
    }
    getUserInfo()
  },[location, id])

  async function deleteUserProfile(){
    try {
      await axios.get(`${backendUrl}api/auth/delete?id=${id}`)
      setUserInfo(null)
      toast.success('User Profile Deleted',{
        position: 'top-right',
      })
      localStorage.removeItem('currentUser')
      window.location.href = '/'
    } catch(err){
      console.log('An Error Occurred',err)
      toast.error(err.response.data.message,{
        position: 'top-right'
      })
    }
  }

  function logOut(){
    toast.success('Logged Out Successfully' ,{
      position: 'top-right'
    })
    localStorage.removeItem('currentUser')
    window.location.href = '/'
    console.log('Clicked')
  }

  function editProfile(){
    navigate(`/edit?id=${id}`)
  }

  return (
    <>
      <div className='w-full flex justify-center items-center'>
      {userInfo && (
        <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2' style={styles.profileCard}>
          <div className='mb-2 lg:mb-0 md:mb-0 grid place-content-center'>
            <img src={userInfo.profileImg !== '' ? userInfo.profileImg : avatar} alt={userInfo.username} style={styles.img}/>
          </div>
          <div className='flex flex-col justify-between items-center w-full'>
            <div className='flex h-1/3 flex-col justify-between items-center'>
              <h2 className='text-xl lg:text-2xl'>{userInfo.username}</h2>
              <p className='mb-2 lg:mb-0 md:mb-0 flex w-full flex-row flex-wrap px-8 justify-center lg:justify-between items-center max-w-max'><span>{userInfo.email}</span> <span title={userInfo.isVerified === true ? 'verified' : 'not verified'}>{userInfo.isVerified === true ? <CircleWavyCheck weight='fill' color='#04dd3a'/> : <XCircle color='#ffa500' weight='fill'/>}</span></p>
            </div>
            <div className='grid grid-cols-2 lg:grid-cols-3 w-full place-content-center'>
              <button className='mb-3 lg:mb-0' style={styles.button} onClick={editProfile}>Edit Profile</button>
              <button style={styles.button} onClick={deleteUserProfile}>Delete</button>
              <button style={styles.button} onClick={logOut}>LogOut</button>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className='w-full flex justify-center items-center p-2 my-4'>
      <Bookmark id={id}/>
    </div>
    </>
  )
}

const styles = {
  img:{
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  profileCard:{
    width: '80%',
    background: '#242424',
    padding: '10px',
    height: 'auto',
    boxShadow: '2px 2px 4px #555',
    borderRadius: '10px'
  },
  button:{
    width: '75%',
    height: '40px',
    background: '#634c7d',
    borderRadius: '5px',
    outline: 'none',
    padding: '5px 0 5px 0'
  }
}