import React, { useEffect, useState } from 'react'
import testImg from '../../assets/avatar.jpg'
import { ThumbsDown, ThumbsUp, Trash } from 'phosphor-react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Replies({ replies, reload, i }) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    async function handleReplyLikesAndDislike(commentId, replyId, userId, action){
        try{
            await axios.post(`${backendUrl}api/reply/review/actions`,{
                commentId,
                replyId,
                userId,
                action
            })
           reload()
            console.log(commentId, replyId, userId, action)
        }catch(err){
            console.log(err.message)
            console.log(commentId, replyId, userId, action)
        }
    }

    async function deleteReply(replyId, commentId){
        try {
            reload()
            await axios.post(`${backendUrl}api/reply/delete?id=${replyId}`, {commentId})
        }catch(err){
            console.log('An Error Occurred',err)
            toast.error(err.response.data.message)
        }
    }


  return (
    <div className='w-full'>
        {replies.length > 0 && replies.map((reply, index)=>{
            const like = reply.likes && reply.likes.includes(i)
            const dislike = reply.dislikes && reply.dislikes.includes(i)
            return(
                <div style={styles.chat} key={index}>
                    <div style={styles.chatImg}>
                        <img src={ reply.imgUrl || testImg } alt="Test" style={styles.img}/>
                        <span style={styles.span}>{reply.username} RE:</span>
                    </div>
                    <p style={styles.message}>{reply.content}</p>
                    <div style={styles.action}>
                        <button disabled={i ? false : true} style={styles.btn} onClick={()=>handleReplyLikesAndDislike(reply.parentId, reply._id, reply.userId, 'like')}><ThumbsUp weight={like ? 'fill' : 'bold'} color={like ? '#6167ff' : 'white'}/> {reply.likes && reply.likes.length}</button>
                        <button disabled={i ? false : true} style={styles.btn}  onClick={()=>handleReplyLikesAndDislike(reply.parentId, reply._id, reply.userId, 'dislike')}><ThumbsDown weight={dislike ? 'fill' : 'bold'} color={dislike ? 'indianred' : 'white'}/> {reply.dislikes && reply.dislikes.length}</button>
                        {reply.userId === i && <button disabled={i ? false : true} onClick={() => deleteReply(reply._id, reply.parentId)}><Trash weight='fill'/></button>}
                    </div>
                </div>
            )
        })}
    </div>
  )
}

const styles = {
    chat:{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '5px',
        padding: '0 7px 7px 7px',
        margin: '0 0 10px 20px',
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
        height: '30px',
        width: '30px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    span:{
        color: '#6167ff',
        fontSize: '14px',
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
}