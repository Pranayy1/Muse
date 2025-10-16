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

const YouTubePlayer = ({ 
  videoId, 
  isPlaying, 
  onReady, 
  onStateChange, 
  onProgress,
  volume = 50,
  onError 
}) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const [isAPIReady, setIsAPIReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('✅ YouTube IFrame API loaded');
        setIsAPIReady(true);
      };
    } else {
      setIsAPIReady(true);
    }
  }, []);

  // Initialize player when API is ready and videoId changes
  useEffect(() => {
    if (!isAPIReady || !videoId || !containerRef.current) {
      return;
    }

    // Destroy existing player if any
    if (playerRef.current && playerRef.current.destroy) {
      playerRef.current.destroy();
    }

    console.log('🎬 Creating YouTube player for video:', videoId);

    // Create new player
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (event) => {
          console.log('✅ YouTube player ready');
          if (onReady) {
            onReady(event);
          }
        },
        onStateChange: (event) => {
          console.log('🔄 Player state changed:', event.data);
          if (onStateChange) {
            onStateChange(event);
          }
        },
        onError: (event) => {
          console.error('❌ YouTube player error:', event.data);
          if (onError) {
            onError(event);
          }
        },
      },
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [isAPIReady, videoId]);

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.playVideo) {
      return;
    }

    if (isPlaying) {
      console.log('▶️ Playing video');
      playerRef.current.playVideo();
    } else {
      console.log('⏸️ Pausing video');
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Handle volume
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume && volume !== undefined) {
      console.log('🔊 Setting volume to:', volume);
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Progress updates
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPlaying && onProgress && playerRef.current) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          onProgress(currentTime, duration);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, onProgress]);

  if (!videoId) {
    return null;
  }

  return (
    <PlayerContainer>
      <div ref={containerRef} id={`youtube-player-${videoId}`} />
    </PlayerContainer>
  );
};

export default YouTubePlayer;