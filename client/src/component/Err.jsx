import React from 'react'

export default function Err({ err }) {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center">
        <p style={{ color: 'indianred', fontWeight: 'bold' }}>{err}</p>
    </div>
  )
}
