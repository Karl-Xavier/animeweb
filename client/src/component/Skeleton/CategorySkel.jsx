import React, { useEffect, useState } from 'react'
import './styles/home.css'

export default function CategorySkel() {

    function getStyles(){
        const screen = window.innerWidth
        const breakPoint = 768
        if(screen > breakPoint){
            return styles.epCon
        }else if(screen < breakPoint){
            return styles.epConSm
        }else{
            return styles.epConMid
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
    <div>
        <div className="row">
            <div className="col-lg-6 col-md-6 h-40 md:h-48 lg:h-96">
                <div className='blink' style={styles.thumbnail}></div>
            </div>
            <div className="col-lg-6 col-md-6">
                <div className='blink' style={styles.title}></div>
                <div className='blink' style={styles.description}></div>
                <div className='blink' style={styles.description}></div>
                <div className='blink' style={styles.description}></div>
                <div className='blink' style={styles.description}></div>
                <div className='blink' style={styles.description}></div>
                <div className='blink' style={styles.descriptionLast}></div>
            </div>
        </div>
        <div className="episode" style={currentStyles}>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
            <div className='blink' style={styles.ep}></div>
        </div>
    </div>
  )
}

const styles = {
    thumbnail:{
        width: '100%',
        height: '100%',
        background: '#3b3b3b',
        borderRadius: '5px'
    },
    title: {
        width: '60%',
        height: '20px',
        background: '#3b3b3b',
        borderRadius: '5px',
        marginTop: window.innerWidth < 768 && '10px',
        marginBottom: '20px'
    },
    description:{
        width: '85%',
        height: '10px',
        marginBottom: '10px',
        background: '#3b3b3b',
        borderRadius: '5px'
    },
    descriptionLast:{
        width: '55%',
        height: '10px',
        background: '#3b3b3b',
        borderRadius: '5px'
    },
    epCon:{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '10px',
        marginTop: '20px'
    },
    epConMid:{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        marginTop: '20px'
    },
    epConSm:{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginTop: '20px'
    },
    ep:{
        width: window.innerWidth > 768 && '100px' || window.innerWidth < 768 && '95px' || window.innerWidth == 768 && '110px',
        height: '40px',
        background: '#3b3b3b',
        borderRadius: '5px'
    }
}