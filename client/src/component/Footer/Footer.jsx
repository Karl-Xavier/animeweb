import { DiscordLogo, WhatsappLogo } from 'phosphor-react'
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
            <a href="https://whatsapp.com/channel/0029VavGnbUD8SE5ZeGk0a2F" target='_blank'><p className='flex flex-row justify-start items-center'><WhatsappLogo size={22} weight='fill' color='#09a309'/> &nbsp; Official Shonenstream</p></a>
            {/* <a href="https://discord.gg/BR2CNS64" target='_blank'><p className='flex flex-row justify-start items-center'><DiscordLogo size={22} weight='fill' color='#7289da'/> &nbsp; Official Shonenstream</p></a> */}
          </div>
        </div>
        <div className='lg:text-center md:text-center'>
          <h3 style={{ color: '#6167ff' }}>PROVIDERS</h3>
          <p><a href="https://anitaku.pe/" target='_blank'>Gogoanime</a></p>
          <p><a href="https://animeyubi.com" target='_blank'>AnimeYubi</a></p>
        </div>
        <div>
          <h3 style={{ color: '#6167ff' }} className='lg:text-right md:text-right'>Contact</h3>
          <p className='lg:text-right md:text-right'><a href="mailto:contactshonenstream@gmail.com">contactshonenstream@gmail.com</a></p>
        </div>
      </div>
      <p style={{ textAlign: 'center', margin: '10px 0 10px 0' }}>Copyright &copy; ShonenStream {new Date().getFullYear()}</p>
    </footer>
  )
}
