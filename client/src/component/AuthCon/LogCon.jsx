import { Envelope, Eye, EyeClosed, User } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import logo from '../../assets/animeTvlogo2.jpg'
import axios from 'axios'

export default function LogCon() {

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

    const [ formData, setFormData ] = useState({
        email: '',
        password: ''
    })

    console.log(formData)

    const [ isPasswordVisible, setPassworVisible ] = useState(false)

    useEffect(()=>{
        document.title = 'Login into your Account | Shonenstream'
    },[])

    function togglePassword(){
        setPassworVisible(!isPasswordVisible)
    }

    function inputChange(e){
        const { name, value } = e.target
        setFormData({
            ...formData, [name]: value
        })
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    async function handleLogin(e){
        e.preventDefault()
        if(formData.email === '' || formData.password === ''){
            toast.error('All fields most be filled',{
                position: 'top-center'
            })
            return
        }

        try{
            const response = await axios.post(`${backendUrl}api/auth/login`, formData)
            const { id, message } = response.data
            const currentUser = localStorage.getItem('currentUser')
            if(currentUser && currentUser !== undefined && currentUser !== id){
                toast.error('A User is Currently logged in on this device',{
                    position: 'top-center'
                })
            }
                localStorage.setItem('currentUser', id)
            toast.success(message,{
                position: 'top-center'
            })
            setFormData({
                email: '',
                password: ''
            })
            setTimeout(()=>{
                navigate('/')
            }, 2000)
        }catch(err){
            console.log('An Error Occurred', err)
            toast.error(err.response.data.message,{
                position: 'top-center'
            })
            setFormData({
                email: '',
                password: ''
            })
        }
    }

  return (
    <div className='w-full h-dvh grid place-content-center'>
        <div style={currentStyles}>
            <img src={logo} alt="" style={styles.logo}/>
        <form style={styles.form} onSubmit={handleLogin}>
            <div style={styles.icon}>
                <input style={styles.input} type="email" placeholder='Email' name='email' className='placeholder-gray-800' onChange={inputChange} value={formData.email}/>
                <Envelope size={22}/>
            </div>
            <div style={styles.icon}>
                <input style={styles.input} type={isPasswordVisible ? 'text' : 'password'} placeholder='Password' name='password' className='placeholder-gray-800' onChange={inputChange} value={formData.password}/>
                <button onClick={togglePassword} type='button'>{isPasswordVisible ? <Eye size={22}/> : <EyeClosed size={22}/>}</button>
            </div>
            <button style={styles.button}>Login</button>
        </form>
        <p>Don't have an Account? <Link to={'/register'}>Register</Link></p>
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
    logo:{
        width: '75px',
        height: '75px',
        mixBlendMode: 'color-dodge',
    }
}