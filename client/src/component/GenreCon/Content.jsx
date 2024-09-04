import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Err from '../Err'
import Loader from '../Loader'
import { MaskSad, WifiSlash, XCircle } from 'phosphor-react'

export default function Content() {
    const { genre } = useParams()
    const [ results, setResult ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [err, setErr] = useState(null)

    const netErr = axios.AxiosError.ERR_NETWORK
    const wrong = axios.AxiosError.ERR_BAD_REQUEST
    const invalid = axios.AxiosError.ERR_INVALID_URL

    useEffect(()=>{
       async function fetchData(){
        try {
            const response = await axios.get(`http://localhost:5003/genre/${genre}`)
            setResult(response.data)
            setLoading(false)
            setErr(null)
        } catch (error) {
            console.log('Error', error)
            setLoading(false)
            if(netErr){
                setErr('No Stable Internet')
                return
            } else if (wrong){
                setErr('Something Went Wrong')
            } else if(invalid){
                setErr('No Such genre')
            }
        }
       }
       fetchData()
    },[genre])

    if(loading){
        return(
            <Loader/>
        )
    }
    if(err){
        return(
            <Err err={err}/>
        )
    }

  return (
    <div>
        <h3>{!err ? 'Results for '+genre : 'No Results Here'}</h3>
        <div className="row my-3">
        {results.map((result, index) => {
            return (
                <div key={index} className="col-lg-3 col-md-4 col-6 mb-3 text-center">
                    <Link to={result.link}>
                        <img style={styles.img} src={result.imgURL} alt="" className="img-fluid rounded-xl" />
                        <p style={styles.title}>{result.title}</p>
                        <span style={styles.released}>{result.released}</span>
                    </Link>
                </div>
            )
        })}
        </div>
    </div>
  )
}

const styles = {
    img: {
        width: '100%',
        height: '280px',
        objectFit: 'cover'
    },
    released: {
        textAlign: 'center',
        fontWeight: '500',
    },
    title: {
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        color: ' #6167ff',
        fontWeight: '600'
    },
    link: {
        textDecoration: 'none'
    }
}