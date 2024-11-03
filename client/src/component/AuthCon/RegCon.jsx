import { Envelope, Eye, EyeClosed, User } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function RegCon() {

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

    function showToat(){
        toast.success('Sucess',{ position: 'top-right' })
    }

  return (
    <div className='w-full h-dvh grid place-content-center'>
        <div style={currentStyles}>
            <h2 className='mb-2'>REGISTER YOUR ACCOUNT</h2>
        <form style={styles.form}>
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
            <button style={styles.button} type='button' onClick={showToat}>Register</button>
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
        background: '#634c7d',
        color: '#eee',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center'
    },
    smallCon:{
        width: '300px',
        height: 'auto',
        background: '#634c7d',
        color: '#eee',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center'
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
        background: '#242424',
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
    }
}