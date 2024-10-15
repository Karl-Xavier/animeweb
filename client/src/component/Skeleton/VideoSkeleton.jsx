import React from 'react';
import './styles/video.css';

export default function VideoSkeleton() {
  return (
    <div className='skeleton-container'>
      <div className='skeleton-video'></div>
      <div className='skeleton-buttons'>
        <div className='skeleton-epbutton'></div>
        <div className='skeleton-epbutton'></div>
      </div>
      <div className='skeleton-download'></div>
    </div>
  );
}
