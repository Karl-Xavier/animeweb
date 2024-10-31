import React, { useRef, useState, useEffect } from 'react'
import Hls from 'hls.js'
import { ArrowsIn, ArrowsOut, Download, FastForward, Pause, Play, Rewind } from 'phosphor-react'
import './video.css'

export default function Video({ hsl, download }) {
  const [iframeSize, setIframeSize] = useState({ width: 800, height: 450 })
  const videoRef = useRef(null)
  const [blob, setBlob] = useState('')
  const [ isPLaying, setIsPlaying ] = useState(false)
  const [ isFullScreen, setIsFullScreen ] = useState(false)
  const [ showControls, setShowControls ] = useState(false)
  const controlsTimeout = useRef(null)
  const [ progress, setProgress ] = useState(0)
  const [ duration, setDuration ] = useState(0)
  const [ currentTime, setCurrentTime ] = useState(0)

  useEffect(() => {
    function updateIframeSize() {
      const windowWidth = window.innerWidth

      let width, height
      if (windowWidth < 768) {
        width = 347
        height = 300
      } else if (windowWidth < 1200) {
        width = 740
        height = 450
      } else {
        width = 980
        height = 570
      }

      setIframeSize({ width, height })
    }

    updateIframeSize()
    window.addEventListener('resize', updateIframeSize)

    return () => window.removeEventListener('resize', updateIframeSize)
  }, [])

  useEffect(() => {
    async function fetchBlob() {
      try {
        const response = await fetch(hsl)
        const data = await response.blob()
        const url = URL.createObjectURL(data)
        setBlob(url)
      } catch (err) {
        console.error('Error Fetching Blob', err)
      }
    }

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(hsl)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        
      })
      return () => hls.destroy()
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      fetchBlob()
    }
  }, [hsl])

  function handleMouseEnter(){
    setShowControls(true)
    resetControlsTimeout()
  }
  function handleMouseLeave(){
    setShowControls(false)
    startControlsTimeout()
  }

  function toggleControls(){
    setShowControls(!showControls)
  }

  function startControlsTimeout(){
    resetControlsTimeout()
      controlsTimeout.current = setTimeout(()=> showControls(false), 3000)
  }

  function resetControlsTimeout(){
    clearInterval(controlsTimeout.current)
  }

  const toggleFullScreen = () => {
    const videoElement = videoRef.current
    if (!document.fullscreenElement) {
      videoElement.requestFullscreen()
      setIsFullScreen(true)
      setShowControls(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  // Detect full screen changes to control visibility
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  useEffect(()=>{
    const video = videoRef.current

    function handleTimeUpdate(){
      setProgress((video.currentTime / video.duration) * 100)
      setCurrentTime(video.currentTime)
    }
    function handleLoadedMeta(){
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMeta)

    return () => {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMeta)
    }
  },[])

  function playPause(){
    const video = videoRef.current
    if(!isPLaying){
      video.play()
    }else{
      video.pause()
    }
    setIsPlaying(!isPLaying)
  }

  function handleSeek(e){
    const video = videoRef.current
    const time = (e.target.value / 100) * video.duration
    video.currentTime = time
    setProgress(e.target.value)
  }

  function formatTime(seconds){
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec < 10 ? `0${sec}` :sec}`
  }

  return (
    <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleControls}
     className='video-container w-full' style={{ height: iframeSize.height, width: iframeSize.width,}}>
      <video
        ref={videoRef}
        src={blob || ''}
        autoPlay={false}
        className='video'
        height={iframeSize.height}
        width={iframeSize.width}
      />
      {showControls && (
        <div className={`controls ${isFullScreen ? 'fullscreen': ''}`}>
        <div className='play-pause'>
          <button onClick={playPause}>{isPLaying ? <Pause size={30} weight='fill'/> : <Play size={30} weight='fill'/>}</button>
        </div>
        <div className='lower-controls w-full'>
          <div className="seek-bar px-1">
            <input type="range" name="" id="" min='0' max='100' value={progress} onChange={handleSeek} style={{ background: `linear-gradient(to right, #634c7d ${progress}%, white ${progress}%)` }}/>
          </div>
          <div className='flex flex-row justify-between items-center px-2'>
            <div className="duration font-extrabold text-gray-900">
              <span>{formatTime(currentTime)}</span> - <span>{formatTime(duration)}</span>
            </div>
            <div className='flex flex-row justify-between items-center action'>
              <a href={download} target='_blank'><button className='dbtn'><Download size={22} weight='fill'/></button></a>
              <button className='outline-none' onClick={toggleFullScreen}>{isFullScreen ? <ArrowsIn size={22} weight='fill'/> :<ArrowsOut size={22} weight='fill'/>}</button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}