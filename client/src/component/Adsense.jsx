import React, { useEffect } from 'react'

export default function Adsense(){
    useEffect(()=>{
        try{
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        }catch(err){
            console.log('Adsense error', err)
        }
    },[])

    return (
    <ins className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-7768811680833881"
     data-ad-slot="1253661550"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
    )
}