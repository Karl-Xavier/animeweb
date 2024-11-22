import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import avatar from '../../assets/avatar.jpg'
import { Pen } from 'phosphor-react'
import { toast } from 'react-toastify'

export default function EditProfile() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const id = queryParams.get('id')

    const [ currentUser, setCurrentUser ] = useState(null)
    const [ userName, setUserName ] = useState('')
    const [ newName, setNewName ] = useState('')
    const [ newImage, setNewImage ] = useState(null)
    const [ newProfileImage, setNewProfileImage ] = useState('')

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    useEffect(()=>{
        async function getCurrentInfo(){
            try{
                const response = await axios.get(`${backendUrl}api/info/user?id=${id}`)
                setCurrentUser(response.data)
                setUserName(response.data.username)
            }catch(err){
                console.log(err.message)
            }
        }

        getCurrentInfo()
        document.title = 'Edit Your Profile | Shonenstream'
    },[location, id])

    function handleTextChange(e){
        setNewName(e.target.value)
    }

    function handleImageChange(e){
        const file = e.target.files[0]
        if(file){
            if(file.type.startsWith('image/')){
                const url = URL.createObjectURL(file)
                setNewImage(url)
            }else {
                setNewImage(null)
            }
        }
    }

    function convertToBase64(e){
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewProfileImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
        console.log(file)
    }

    async function editChanges(e){
        e.preventDefault()
        try {
            if(newName.trim() === '' && newProfileImage === ''){
                toast.info('No Changes were made',{
                    position: 'top-center'
                })
                navigate(`/profile?id=${id}&username=${currentUser.username}`)
                return
            }
            const payload = {}

            if(newName.trim() !== ''){
                payload.username = newName
            }

            if(newProfileImage){
                payload.profileImg = newProfileImage
            }

            const response = await axios.post(`${backendUrl}api/info/editUser?id=${id}`,payload)
            const message = response.data.message
            toast.success(message,{
                position: 'top-right'
            })
            window.location.href = '/'
        } catch(err){
            console.log('An Error Occurred',err)
            toast.error(err.response.data.message,{
                position: 'top-right'
            })
        }
    }

  return (
    <div className='w-full flex justify-center items-center'>
        {currentUser && (
            <div className="grid grid-cols-1" style={styles.card}>
                <div style={styles.formDiv}>
                <form style={styles.form} onSubmit={editChanges}>
                    <label style={styles.img} htmlFor='new'>
                        <img src={newImage ? newImage : (currentUser.profileImg ? currentUser.profileImg : avatar)} alt={currentUser.username} style={styles.avatar}/>
                    </label>
                    <input type="file" name="new" id="new" style={{ display: 'none' }} onChange={(e)=>{
                        handleImageChange(e)
                        convertToBase64(e)
                    }}/>
                    <input type="text" value={newName || userName} style={styles.input} onChange={(e) => handleTextChange(e)}/>
                    <button style={styles.button}>EDIT <Pen size={24} weight='fill'/></button>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

const styles = {
    card:{
        width: '85%',
        height: 'auto',
        background: '#242424',
        padding: '10px',
        boxShadow: '2px 2px 4px #555',
        borderRadius: '10px'
    },
    img:{
        width: '100%',
        display: 'grid',
        placeContent: 'center',
        margin: '0 0 10px 0',
        cursor: 'pointer'
    },
    avatar:{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    formDiv:{
        width: '100%',
        height: 'auto'
    },
    form:{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
    },
    input:{
        width: '75%',
        height: '40px',
        padding: '5px',
        outline: 'none',
        color: '#242424',
        borderRadius: '7px',
        background: 'rgba(238, 238, 238, 0.6)'
    },
    button:{
        width: '120px',
        height: '40px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        background: '#634c7d',
        color: '#eee',
        padding: '10px'
    }
}