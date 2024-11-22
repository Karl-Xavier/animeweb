import { Bookmarks, Trash } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import testimg from '../../assets/animeTvlogo2.jpg'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Bookmark({ id }) {

    const [ bookMark, setBookMark ] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(()=>{
        async function getAllBook(){
            try {
                const response = await axios.get(`${backendUrl}api/bookmark/get?id=${id}`)
                const data = response.data
                setBookMark(data)
            } catch(err){
                console.log(err)
            }
        }
        getAllBook()
    },[])

    async function deleteBookmark(id){
        try {
            await axios.get(`${backendUrl}api/bookmark/delete?id=${id}`)
            toast.success('Removed 1 Bookmark',{
                position: 'top-right'
            })
            window.location.href = '/profile'
        } catch(err){
            console.log('An Error Occurred',err)
            toast.error(err.response.data.message,{
                position: 'top-right'
            })
        }
    }

  return (
    <div style={styles.container}>
        <h2 className='text-xl lg:md:text-2xl' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', maxWidth: 'max-content' }}>Available Bookmarks&nbsp;&nbsp;&nbsp;<Bookmarks weight='fill' size={25}/></h2>
        {bookMark.length > 0 ? bookMark.map((book, index)=>{
            return(
                <div style={{ width: '100%', height: 'auto', boxShadow: '2px 2px 4px #555', padding: '10px' }} className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-3 my-3' key={index}>
                    <div className='w-full'>
                        <img src={book.imgUrl || testimg} alt={book.title} style={styles.img} className='w-full lg:w-52'/>
                    </div>
                    <div className='w-full'>
                        <div className="w-full">
                        <h3 className='font-bold'><span style={styles.span}>Title:</span> {book.title.replace(/\sEpisode\s\d+\s(?:Sub|Dub)$/, '').trim()}</h3>
                        <p className='font-bold'><span style={styles.span}>Episode:</span> {book.episode}</p>
                        <div className='w-full flex flex-row justify-evenly items-center my-2'>
                        <Link to={`/watch/${book.link}`}>
                            <button style={styles.button}>Watch</button>
                        </Link>
                        <button style={{...styles.button, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}} onClick={()=>deleteBookmark(book._id)}>Remove <Trash weight='fill' size={22}/></button>
                        </div>
                        </div>
                    </div>
                </div>
            )
        }):(
            <div className='w-full h-svh flex flex-col justify-center items-center'>
                <p>Nothing Here</p>
            </div>
        )}
    </div>
  )
}

const styles = {
    container:{
        width: '80%',
        height: 'auto'
    },
    img:{
        height: '200px',
        borderRadius: '10px',
        objectFit: 'cover'
    },
    span:{
        color: '#6167ff'
    },
    button:{
        width: '120px',
        height: '40px',
        padding: '10px',
        outline: 'none',
        borderRadius: '5px',
        border: 'none',
        background: '#634c7d',
        color: '#eee'
    }
}