import React, { useRef, useState, useEffect } from 'react'
import Hls from 'hls.js'
import { ArrowClockwise, ArrowCounterClockwise, ArrowsIn, Download, Gear, Pause, Play } from 'phosphor-react'
import './video.css'

export default function Video({ hsl, vipani, download }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [ isPLaying, setIsPlaying ] = useState(false)
  const [ isScreen, setIsScreen ] = useState(false)
  const [ progress, setProgress ] = useState(0)
  const [ duration, setDuration ] = useState(0)
  const [ currentTime, setCurrentTime ] = useState(0)
  const [playBack, setPlayBack] = useState(1)
  const [ playbackDiv, setPlayBackDiv ] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const hlsUrl = `${backendUrl}api/proxy?url=${encodeURIComponent(hsl)}`
  const vipaniUrl = vipani

/*   useEffect(() => {
    if(videoRef.current){
      if(Hls.isSupported()){
        const hls = new Hls({ debug: true })
        hls.loadSource(hlsUrl)
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MANIFEST_PARSED, ()=>{
          console.log('Manifest loaded, found ' + hls.levels.length + ' quality level');
        })
        hls.on(Hls.Events.ERROR, (e,d)=>{
          if(d.fatal){
            switch(d.type){
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network Error')
                hls.startLoad()
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media Error')
                hls.recoverMediaError()
                break;
              case Hls.ErrorTypes.OTHER_ERROR:
                console.log('Other Error')
                break;
              default:
                console.log('Fatal Error')
                break;
            }
          }
        })


        return () => {
          if(hls){
            hls.destroy()
          }
        }

      }
    }
  }, [hsl]) */

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({ debug: true });
        hlsRef.current = hls;

        let currentUrl = vipaniUrl; // Start with vipaniUrl

        const loadSource = (url) => {
          currentUrl = url;
          hls.loadSource(url);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(`Loaded ${url}`);
          });
        };

        hls.on(Hls.Events.ERROR, (e, d) => {
          if (d.fatal) {
            switch (d.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("Network Error");
                if (currentUrl === vipaniUrl) {
                  console.log("Switching to fallback URL");
                  loadSource(hlsUrl); // Switch to fallback
                } else {
                  console.log("Both URLs failed to load");
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("Media Error");
                hls.recoverMediaError();
                break;
              default:
                console.log("Fatal Error");
                break;
            }
          }
        });

        loadSource(vipaniUrl); // Load the primary URL initially

        return () => {
          if (hls) {
            hls.destroy();
          }
        };
      }
    }
  }, []);

  

  const toggleFullScreen = () => {
    const videoElement = videoRef.current
    if (!document.fullscreenElement) {
      videoElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

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
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMeta)
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

  function fastForward(){
    const video = videoRef.current
    video.currentTime = Math.min(video.duration, video.currentTime + 10)
  }
  function rewind(){
    const video = videoRef.current
    video.currentTime = Math.max(0, video.currentTime - 10)
  }

  function handleSeek(e){
    const video = videoRef.current
    /* const time = (e.target.value / 100) * video.duration
    video.currentTime = time
    setProgress(e.target.value) */
    const bar = e.currentTarget
    const clickPosition = e.nativeEvent.offsetX
    const barWidth = bar.offsetWidth
    const time = (clickPosition / barWidth) * video.duration
    video.currentTime = time
    setProgress((time / video.duration) * 100)
  }

  function formatTime(seconds){
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec < 10 ? `0${sec}` :sec}`
  }

  function tooglePlayBackDiv(){
    setPlayBackDiv(!playbackDiv)
  }

  function handlePlayBackSpeed(speed){
    const video = videoRef.current
    video.playbackRate = speed
    setPlayBack(speed)
  }

  function mouseOverCtrl(){
    setIsScreen(true)
    console.log('screen')
  }
  function mouseLeaveCtrl(){
    setIsScreen(false)
  }

  return (
    <div className='w-full h-full absolute'>
      <div className='video-player' onMouseEnter={mouseOverCtrl} onMouseLeave={mouseLeaveCtrl}>
        <video ref={videoRef} className='main-player'></video>
        {/* <iframe ref={videoRef} src={videoSrc} frameborder="0"></iframe> */}
      <div className={isScreen ? 'controls active' : 'controls'}>
      <div className="progress" onClick={handleSeek}>
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <span></span>
        </div>
      </div>
        <div className="list">
        <div className="control-left">
          <button className='rewind' onClick={rewind}>
            <ArrowCounterClockwise size={25} weight='bold'/>
          </button>
          <button onClick={playPause}>
            {isPLaying ? <Pause size={25} weight='fill'/> :<Play size={25} weight='fill'/>}
          </button>
          <button className='fast' onClick={fastForward}>
            <ArrowClockwise size={25} weight='bold'/>
          </button>
          <div className="timer">
            <span>{formatTime(currentTime)}</span> - <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="control-right">
          <button className='gear' onClick={tooglePlayBackDiv}>
            <Gear weight='fill' size={25}/>
          </button>
          <a href={download}>
          <button>
            <Download size={25} weight='fill'/>
          </button>
          </a>
          <button onClick={toggleFullScreen}>
            <ArrowsIn size={25} weight='fill'/>
          </button>
        </div>
        {playbackDiv && (
          <div className="settings">
          <div className="playback">
            <span>Playback Speed</span>
            <ul>
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed)=>(
                <li data-speed={speed} key={speed} onClick={()=>handlePlayBackSpeed(speed)} className={playBack === speed ? 'active' : ''}>
                  {speed === 1 ? 'Normal' : `${speed}x`}
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}
        </div>
      </div>
      </div>
    </div>
  )
}