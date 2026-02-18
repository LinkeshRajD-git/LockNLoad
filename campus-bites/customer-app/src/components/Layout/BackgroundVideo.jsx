import { useState, useEffect } from 'react';

export default function BackgroundVideo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="video-bg-container">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setLoaded(true)}
        className={`video-bg ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
        poster="https://images.unsplash.com/photo-1630384060421-cb20aebe94eb?q=80&w=1920&auto=format&fit=crop"
      >
        {/* Fries cooking / saucing stock video */}
        <source
          src="https://videos.pexels.com/video-files/3298572/3298572-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark gradient overlay */}
      <div className="video-overlay" />

      {/* Animated grain/noise texture for cinematic feel */}
      <div className="video-grain" />
    </div>
  );
}
