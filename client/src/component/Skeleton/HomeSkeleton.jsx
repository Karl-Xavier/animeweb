import React, { useEffect, useState } from 'react'
import './styles/home.css'

export default function HomeSkeleton() {

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 768
        if(screen > breakPoint){
            return styles.bigScreen
        }else if(screen < breakPoint){
            return styles.smScreen
        }else{
            return styles.midScreen
        }
    }

    const [currentStyles, setCurrentStyles] = useState(getStyles())

    useEffect(()=>{
        function handleResize(){
            setCurrentStyles(getStyles())
        }

        window.addEventListener('resize', handleResize)

        return ()=>{
            window.removeEventListener('resize', handleResize)
        }
    },[])

  return (
    <div className='container grid place-content-center'>
        <div className="my-3 w-full" style={currentStyles}>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div className="w-36 h-52 lg:w-48 md:w-44">
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
        </div>
    </div>
  )
}

const styles = {
    thumbnail:{
        width: '100%',
        height: '75%',
        background: '#38384f',
        borderRadius: '5px'
    },
    title:{
        width: '100%',
        height: '20px',
        background: '#38384f',
        margin: '10px 0 0 0',
        borderRadius: '5px'
    },
    bigScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        placeContent: 'center'
    },
    midScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        placeContent: 'center'
    },
    smScreen:{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        placeContent: 'center'
    }
}