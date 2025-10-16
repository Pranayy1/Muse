import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: absolute;
  top: -200px;
  left: -200px;
  width: 320px;
  height: 180px;
  opacity: 0.01; /* Nearly invisible but still functional */
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const YouTubePlayer = ({ 
  videoId, 
  isPlaying, 
  onReady, 
  onStateChange, 
  onProgress,
  volume = 50,
  onError 
}) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const iframeRef = useRef(null);

  // Simulate player ready
  useEffect(() => {
    if (videoId && !isReady) {
      console.log('Setting up YouTube player for video:', videoId);
      
      const mockPlayer = {
        playVideo: () => {
          console.log('▶️ Playing video:', videoId);
          if (onStateChange) onStateChange({ data: 1 }); // playing
        },
        pauseVideo: () => {
          console.log('⏸️ Pausing video:', videoId);
          if (onStateChange) onStateChange({ data: 2 }); // paused
        },
        stopVideo: () => {
          console.log('⏹️ Stopping video:', videoId);
          if (onStateChange) onStateChange({ data: 0 }); // ended
        },
        seekTo: (seconds) => {
          console.log('⏭️ Seeking to:', seconds);
          setCurrentTime(seconds);
        },
        getCurrentTime: () => currentTime,
        getDuration: () => 210, // Mock 3.5 minute duration
        setVolume: (vol) => console.log('🔊 Volume set to:', vol),
        getPlayerState: () => isPlaying ? 1 : 2
      };

      setPlayer(mockPlayer);
      setIsReady(true);
      
      if (onReady) {
        onReady({ target: mockPlayer });
      }
    }
  }, [videoId, isReady, onReady, onStateChange, currentTime, isPlaying]);

  // Handle play/pause changes
  useEffect(() => {
    if (player && isReady) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying, player, isReady]);

  // Progress simulation
  useEffect(() => {
    if (isPlaying && onProgress && isReady) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (onProgress) {
            onProgress(newTime, 210); // Mock duration
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, onProgress, isReady]);

  if (!videoId) {
    return null;
  }

  // Create YouTube embed URL with autoplay
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}&enablejsapi=1&mute=0&start=0&rel=0&modestbranding=1`;

  return (
    <PlayerContainer>
      <StyledIframe
        ref={iframeRef}
        src={embedUrl}
        title="YouTube audio player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </PlayerContainer>
  );
};

export default YouTubePlayer;