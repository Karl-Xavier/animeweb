import React from 'react'
import { ClipLoader } from 'react-spinners'

export default function Loader() {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
        <ClipLoader
          height="18"
          width="18"
          color='#ee49fd'
        />
    </div>
  )
}
