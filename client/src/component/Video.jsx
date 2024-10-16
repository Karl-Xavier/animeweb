import React, { useRef, useState, useEffect } from 'react';

export default function Video({ video }) {
  const iframeRef = useRef(null);
  const [iframeSize, setIframeSize] = useState({ width: 800, height: 450 });

  useEffect(() => {
    function updateIframeSize() {
      const windowWidth = window.innerWidth;

      let width, height;
      if (windowWidth < 768) {
        width = windowWidth - 40
        height = 300
      } else if (windowWidth < 1200) {
        width = 700
        height = 450
      } else {
        width = 980
        height = 570
      }

      setIframeSize({ width, height });
    }

    updateIframeSize(); // Set initial size
    window.addEventListener('resize', updateIframeSize); // Adjust on resize

    return () => window.removeEventListener('resize', updateIframeSize);
  }, [])

  return (
    <div style={styles.container}>
      <iframe
        ref={iframeRef}
        src={video}
        allow="autoplay; fullscreen"
        title="Video"
        width={iframeSize.width}
        height={iframeSize.height}
        frameBorder="0"
        marginWidth="0"
        marginHeight="0"
        scrolling="no"
        style={styles.iframe}
      ></iframe>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '20px',
  },
  iframe: {
    borderRadius: '8px',
  },
};
