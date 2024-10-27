//import { FacebookLogo, InstagramLogo, TwitterLogo } from 'phosphor-react'
import React from 'react'

export default function Footer() {

  return (
    <footer style={{ color: '#eee', /* textAlign: 'center' */ background: '#242424' }} className='p-4 text-sm lg:text-lg'>
      <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-3'>
        <div>
          <h3 style={{ color: '#6167ff', textAlign: 'left' }}>SOCIAL MEDIA</h3>
          <div>
            {/* <p className='flex flex-row justify-start items-center'><FacebookLogo/> &nbsp; shonenstream official</p>
            <p className='flex flex-row justify-start items-center'><TwitterLogo/> &nbsp; shonenstream official</p>
            <p className='flex flex-row justify-start items-center'><InstagramLogo/> &nbsp; shonenstream official</p> */}
            <p>None for now</p>
          </div>
        </div>
        <div className='lg:text-center md:text-center'>
          <h3 style={{ color: '#6167ff' }}>PROVIDERS</h3>
          <p>Gogoanime</p>
          <p><a href="https://animeyubi.com">AnimeYubi</a></p>
        </div>
        <div>
          <h3 style={{ color: '#6167ff' }} className='lg:text-right md:text-right'>UPDATE</h3>
          <p className='lg:text-right md:text-right'>contact@shonenstream.com</p>
          <p style={{ fontSize: '14px' }} className='lg:text-right md:text-right'>Please Bear with the video ads. We Are working on it.</p>
        </div>
      </div>
      <p style={{ textAlign: 'center' }}>Copyright &copy; ShonenStream</p>
    </footer>
  )
}
