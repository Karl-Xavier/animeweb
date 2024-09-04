import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../Loader'
import Err from '../Err'

export default function Content() {

  const [ popular, setPopular ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ err, setErr ] = useState(null)

  const netErr = axios.AxiosError.ERR_NETWORK
    const wrong = axios.AxiosError.ERR_BAD_REQUEST
    const wroRes = axios.AxiosError.ERR_BAD_RESPONSE
    const invalid = axios.AxiosError.ERR_INVALID_URL

  useEffect(()=>{
    async function fetchPopularPage(){
      try{
        const response = await axios.get('http://localhost:5003/popular')
        setPopular(response.data)
      } catch(err){
        console.log(err)
      }
    }
    fetchPopularPage()
  },[])

  return (
    <div className='container'>
      
    </div>
  )
}
