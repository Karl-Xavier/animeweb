import { Envelope, Eye, EyeClosed, User } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import logo from '../../assets/animeTvlogo2.jpg'

export default function RegCon() {

    const navigate = useNavigate()

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 600
        if(screen > breakPoint){
            return styles.largeCon
        }
        return styles.smallCon
    }

    const [ currentStyles, setCurrentStyles ] = useState(getStyles())

    useEffect(()=>{
        function handleResize(){
            setCurrentStyles(getStyles())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    },[])

    useEffect(()=>{
        document.title = 'Register Your Account | Shonenstream'

        const adContainer = document.getElementById('ad-container')
        if(adContainer){
            adContainer.remove()
        }

    },[])

    const [ formData, setFormData ] = useState({
        username: '',
        email: '',
        password: '',
        profileImg: '',
    })
    const [ img, setImg ] = useState(null)
    const [ isPasswordVisible, setPassworVisible ] = useState(false)

    function togglePassword(){
        setPassworVisible(!isPasswordVisible)
    }

    function inputChange(e){
        const { name, value } = e.target
        setFormData({
            ...formData, [name]: value
        })
    }

    function handleImageChange(e){
        const file = e.target.files[0]
        if(file){
            if(file.type.startsWith('image/')){
                const url = URL.createObjectURL(file)
                setImg(url)
            }else{
                setImg(null)
            }
        }
    }

    function convertToBase64(e){
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({
                    ...formData, profileImg: reader.result
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    async function handleRegister(e){
        e.preventDefault()
        try {
            if(formData.username === '' || formData.email === '' || formData.password === ''){
                toast.error('All fields most be filled',{
                    position: 'top-center'
                })
                return
            }
            const currentUser = localStorage.getItem('currentUser')
            if(currentUser){
                toast.error('A User is Currently Logged in on this device',{
                    position: 'top-center'
                })
                return
            }
            const response = await axios.post(`${backendUrl}api/auth/sign-up`, formData)
            const { id, message } = response.data
            localStorage.setItem('currentUser', id)
            toast.success(message,{
                position: 'top-center'
            })
            setFormData({
                username: '',
                email: '',
                password: '',
                profileImg: ''
            })
            navigate('/verify')
        } catch(err){
            console.log('An Error Occurred',err)
            toast.error(err.response.data.message,{
                position: 'top-center'
            })
            setFormData({
                username: '',
                email: '',
                password: '',
                profileImg: ''
            })
        }
    }

  return (
    <div className='w-full h-dvh grid place-content-center'>
        <div style={currentStyles}>
            <img src={logo} alt="" style={styles.logo}/>
        <form style={styles.form} onSubmit={handleRegister}>
            <div className='w-full flex flex-col items-center'>
            <label htmlFor="img" style={styles.label}>
                <img src={img} alt="" style={styles.img}/>
            </label>
            <input type="file" name="img" id="img" style={{ display: 'none' }} onChange={(e)=>{
                handleImageChange(e)
                convertToBase64(e)
            }}/>
            <span className='my-2'>Add Your Profile Picture</span>
            </div>
            <div style={styles.icon}>
                <input style={styles.input} type="text" placeholder='Username' name='username' className='placeholder-gray-800' onChange={inputChange} value={formData.username}/>
                <User size={22}/>
            </div>
            <div style={styles.icon}>
                <input style={styles.input} type="email" placeholder='Email' name='email' className='placeholder-gray-800' onChange={inputChange} value={formData.email}/>
                <Envelope size={22}/>
            </div>
            <div style={styles.icon}>
                <input style={styles.input} type={isPasswordVisible ? 'text' : 'password'} placeholder='Password' name='password' className='placeholder-gray-800' onChange={inputChange} value={formData.password}/>
                <button onClick={togglePassword} type='button'>{isPasswordVisible ? <Eye size={22}/> : <EyeClosed size={22}/>}</button>
            </div>
            <button style={styles.button} type='submit'>Register</button>
        </form>
        <p>Already have an Account? <Link to={'/login'}>Login</Link></p>
        </div>
    </div>
  )
}

const styles = {
    largeCon:{
        width: '600px',
        height: 'auto',
        background: '#242424',
        color: '#eee',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        boxShadow: '2px 2px 4px #555'
    },
    smallCon:{
        width: '340px',
        height: 'auto',
        background: '#242424',
        color: '#eee',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        boxShadow: '2px 2px 4px #555'
    },
    form:{
        width: '100%', 
    },
    icon:{
        width: '100%',
        height: '38px',
        background: 'rgba(238, 238, 238, 0.6)',
        color: '#242424',
        borderRadius: '7px',
        margin: '0 0 10px 0',
        padding: '5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input:{
        width: '100%',
        outline: 'none',
        background: 'transparent',
        color: '#242424'
    },
    button:{
        background: '#634c7d',
        width: '120px',
        height: '40px',
        outline: 'none',
        borderRadius: '7px',
        margin: '0 0 10px 0'
    },
    label:{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: '#eee',
        cursor: 'pointer'
    },
    img:{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    logo:{
        width: '75px',
        height: '75px',
        mixBlendMode: 'color-dodge',
    }
}