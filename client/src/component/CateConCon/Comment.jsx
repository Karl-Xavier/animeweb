import { ArrowFatRight, PaperPlaneTilt, ThumbsDown, ThumbsUp, Trash, X, XCircle } from 'phosphor-react'
import React, { useState, useEffect } from 'react'
import testImg from '../../assets/avatar.jpg'
import './c.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import Replies from './Replies'
import Loader from '../Loader'

export default function Comment({ setShowComment, animeTitle }) {

    function getStyles(){
        if(window.innerWidth < 600){
            return styles.small
        }
        return styles.container
    }

    const [ currentStyles, setCurrentStyles ] = useState(getStyles())

    useEffect(()=>{
        function handleResize(){
            setCurrentStyles(getStyles())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    },[])

    const [ comments, setComments ] = useState([])
    const [ totalCom, setTotalCom ] = useState(0)
    const [ content, setContent ] = useState('')
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ replyTo, setReplyTo ] = useState(null)
    const [ isReplyTo, setIsReplyTo ] = useState(false)
    const i = localStorage.getItem('currentUser')
    const [ toggleSpan, setToggleSpan ] = useState(false)
    const [ loading, setLoading ] = useState(true)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    useEffect(()=>{
        async function fetchDetails(){
            try {
                const response = await axios.get(`${backendUrl}api/info/user?id=${i}`)
                setCurrentUser(response.data)
            } catch(err){
                console.log(err.message)
            }
        }
        fetchDetails()
    },[])

    function toggleSpanText(){
        setToggleSpan(!toggleSpan)
    }

    async function fetchAllComments(){
        try {
            const response = await axios.get(`${backendUrl}api/get/comment?relateTo=${animeTitle}`)
            setLoading(false)
            setComments(response.data.comment)
            setTotalCom(response.data.total)
            console.log(response.data)
        } catch(err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        fetchAllComments()
    },[])

    async function handleLikesAndDislike(commentId, action){
        try{
            const { data } = await axios.post(`${backendUrl}api/comment/action`,{
                commentId,
                userId: i,
                action
            })
            setComments(prev => 
                prev.map(comment => 
                    comment._id === commentId 
                        ? { ...comment, likes: data.likes, dislikes: data.dislikes } 
                        : comment
                )
            )
            console.log(data)
            console.log(action)
        }catch(err){
            console.log(err.message)
        }
    }

    async function handleSendComment(){
        const payload = {}
        payload.animeEp = animeTitle
        payload.username = currentUser.username
        payload.imgUrl = currentUser.profileImg
        payload.content = content
        payload.userId = currentUser.userId
        if(content.trim() === ''){
            toast.error('Enter a Valid message body',{
                position: 'bottom-right'
            })
        }
        try {
            setComments(prev=>[...prev, payload])
            setTotalCom(totalCom+1)
            setContent('')
            await axios.post(`${backendUrl}api/post/comment`, payload)
            const response = await axios.get(`${backendUrl}api/get/comment?relateTo=${animeTitle}`)
            setComments(response.data.comment)
            setTotalCom(response.data.total)
        } catch(err){
            console.log(err.message)
            setContent('')
            toast.error(err.respone.data.message,{
                position: 'bottom-right'
            })
        }
    }

    function setReply(username, parentId){
        setReplyTo(parentId)
        setContent(`${username} - `)
        setIsReplyTo(true)
    }

    function cancelReply(){
        setIsReplyTo(false)
        setContent('')
    }

   async function handleSubmitReply(){
        const payload = {}
        payload.username = currentUser.username
        payload.imgUrl = currentUser.profileImg
        payload.content = content
        payload.userId = currentUser.userId
        payload.parentId = replyTo
        console.log(replyTo)
        console.log(payload)
        if(content.trim() === ''){
            toast.error('Enter a valid reply',{
                position: 'bottom-right'
            })
        }
        try {
            setContent('')
            setIsReplyTo(false)
            await axios.post(`${backendUrl}api/comment/reply`,payload)
           fetchAllComments()
        } catch(err){
            setContent('')
            console.log('An Error Occurred',err.message)
            toast.error(err.response.data.message,{
                position: 'bottom-right'
            })
            setIsReplyTo(false)
        }
    }

    // Delete Comment //
    async function deleteComment(commentId){
        try {
            setTotalCom(totalCom - 1)
            setComments(prev=> prev.filter(commet => commet._id !== commentId))
            await axios.post(`${backendUrl}api/comment/delete?id=${commentId}`)
            fetchAllComments()
        } catch (err){
            console.log(err.message)
            console.log(commentId)
        }
    }

  return (
    <div style={currentStyles}>
        <header style={styles.header}>
            <h2>Comments <span>({totalCom})</span></h2>
            <button onClick={()=>setShowComment(false)}><X size={22} weight='bold'/></button>
        </header>
        <main style={styles.main} className='chat'>
            {loading && (
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <Loader/>
                </div>
            )}
            {comments && comments.length > 0 ? comments.map((comment, index)=>{
                const like = comment.likes && comment.likes.includes(i)
                const dislike = comment.dislikes && comment.dislikes.includes(i)
                return (
                    <div style={styles.chat} key={index}>
                        <div style={styles.chatImg}>
                            <img src={ comment.imgUrl || testImg } alt="Test" style={styles.img}/>
                            <span style={styles.span}>{comment.username}</span>
                        </div>
                        <p style={styles.message}>{comment.content}</p>
                        <div style={styles.action}>
                            <button disabled={i ? false : true} style={styles.btn} onClick={()=>handleLikesAndDislike(comment._id, 'like')}><ThumbsUp weight={like ? 'fill' : 'bold'} color={like ? '#6167ff' :'#eee'}/> {comment.likes && comment.likes.length}</button>
                            <button disabled={i ? false : true} style={styles.btn} onClick={()=>handleLikesAndDislike(comment._id, 'dislike')}><ThumbsDown weight={dislike ? 'fill' : 'bold'} color={dislike ?'indianred' : '#eee'}/> {comment.dislikes &&comment.dislikes.length}</button>
                            <button disabled={i ? false : true} onClick={()=>setReply(comment.username, comment._id)}><ArrowFatRight/></button>
                            {comment.userId === i && <button disabled={i ? false : true} onClick={() => deleteComment(comment._id)}><Trash weight='fill'/></button>}
                        </div>
                        {comment.replies && comment.replies.length > 0 && (<span style={{ fontSize: '12px', textDecoration: 'underline', color: '#6167ff', cursor: 'pointer' }} className="my-3" onClick={toggleSpanText}>{!toggleSpan ? 'Show Replies' : 'Hide Replies'}</span>)}
                        {toggleSpan && (comment.replies && comment.replies.length > 0 && (
                            <Replies replies={comment.replies} reload={fetchAllComments} handleReply={setReply} i={i}/>
                        ))}
                    </div>
                )
            }):(
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <p style={{ fontWeight: '700', color: '#6167ff', fontSize: '16px' }}>No Comment Yet</p>
                    <span style={{ fontWeight: '700', color: '#6167ff', fontSize: '12px' }}>Be The First To Comment</span>
                </div>
            )}
        </main>
        <div style={styles.msgBox}>
            {isReplyTo && (
                <button onClick={cancelReply}><XCircle size={14}/></button>
            )}
            <textarea name="" id="Message Input" placeholder={i ? 'Write Message...' : '     SignUp / Login to Comment'} style={styles.input} value={content} onChange={ (e)=>setContent(e.target.value)} disabled={i ? false : true}></textarea>
            {i && <button onClick={isReplyTo ? handleSubmitReply : handleSendComment} disabled={content ? false : true}><PaperPlaneTilt size={22} weight='fill' color='#6167ff'/></button>}
        </div>
    </div>
  )
}

const styles = {
    container:{
        position: 'absolute',
        height: '600px',
        width: '400px',
        background: '#242424',
        color: '#eee',
        right: '10px',
        borderRadius: '10px',
        padding: '10px',
        zIndex: 99,
        
    },
    small:{
        position: 'absolute',
        height: '600px',
        width: '100%',
        background: '#242424',
        color: '#eee',
        right: '10px',
        borderRadius: '10px',
        padding: '10px',
        zIndex: 99,
    },
    header: {
        borderBottom: '1px solid lightgrey',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px'
    },
    main:{
        height: '85%',
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden'
    },
    chat:{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '5px',
        padding: '7px',
        margin: '0 0 10px 0'
    },
    chatImg:{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '10px'
    },
    img:{
        height: '45px',
        width: '45px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    span:{
        color: '#6167ff',
        maxWidth: '70%',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    action:{
        width: 'max-content',
        height: '20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '10px',
        gap: '10px'
    },
    btn:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: '5px'
    },
    msgBox:{
        width: '100%',
        height: '48px',
        background: '#242424',
        color: '#eee',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        borderTop: '1px solid #000'
    },
    input: {
        width: '100%',
        height: '40px',
        background: 'transparent',
        outline: 'none',
        overflow: 'hidden',
        padding: '6px'
    }
}