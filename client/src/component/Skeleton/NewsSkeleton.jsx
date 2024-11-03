import React, { useEffect, useState } from 'react'
import './styles/home.css'

function NewsSkeleton() {

    const styles = {
        main:{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: '10px',
            placeContent: 'center'
        },
        mainSm:{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(1,1fr)',
            gap: '10px',
            placeContent: 'center'
        },
        thumbnail:{
            width: '100%',
            height: '75%',
            borderRadius: '5px',
            background: '#2a2a2a'
        },
        title: {
            width: '100%',
            height: '20px',
            borderRadius: '5px',
            background: '#2a2a2a',
            marginTop: '20px'
        }
    }

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 768
        if(screen > breakPoint){
                return { width:'500px', height: '380px'}
        } else if(screen < breakPoint){
            return { width: '300px', height: '200px' }
        }else{
            return {width: '350px', height: '270px'}
        }  
    }

    function changeMain(){
        const screen = window.innerWidth
        const breakPoint = 600
        if(screen > breakPoint){
            return styles.main
        }else{
            return styles.mainSm
        }
    }

    const [ currentStyles, setCurrentStyles ] = useState(getStyles())
    const [ currentMain, setCurrentMain ] = useState(changeMain())

    useEffect(()=>{
        function handleResize(){
            setCurrentStyles(getStyles())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    },[])

    useEffect(()=>{
        function handleResiz(){
            setCurrentMain(changeMain())
        }

        window.addEventListener('resize', handleResiz)
        return () => window.removeEventListener('resize', handleResiz)
    },[])

    return (
    <div className='container grid place-content-center'>
        <div style={currentMain}>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
            <div style={currentStyles}>
                <div className='blink' style={styles.thumbnail}></div>
                <div className='blink' style={styles.title}></div>
            </div>
        </div>
    </div>
  )
}

export default NewsSkeleton