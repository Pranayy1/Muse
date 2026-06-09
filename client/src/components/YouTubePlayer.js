import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: absolute;
  top: -200px;
  left: -200px;
  width: 320px;
  height: 180px;
  opacity: 0.01;
  pointer-events: none;
`;

let apiReadyPromise = null;

const loadYouTubeAPI = () => {
  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const timeoutId = setTimeout(() => {
      apiReadyPromise = null;
      resolve();
    }, 10000);

    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeoutId);
      if (typeof originalCallback === 'function') {
        originalCallback();
      }
      resolve();
    };
  });

  return apiReadyPromise;
};

const YouTubePlayer = ({
  videoId,
  isPlaying,
  onReady,
  onStateChange,
  volume = 100,
  onError
}) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(true);

  const stableOnReady = useRef(onReady);
  const stableOnStateChange = useRef(onStateChange);
  const stableOnError = useRef(onError);

  useEffect(() => {
    stableOnReady.current = onReady;
    stableOnStateChange.current = onStateChange;
    stableOnError.current = onError;
  }, [onReady, onStateChange, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    let destroyed = false;

    loadYouTubeAPI().then(() => {
      if (destroyed || !containerRef.current) return;

      if (!window.YT || !window.YT.Player) {
        if (isMountedRef.current && stableOnError.current) {
          stableOnError.current({ data: 'YouTube API failed to load' });
        }
        return;
      }

      if (playerRef.current) {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
        playerRef.current = null;
      }

      try {
        const player = new window.YT.Player(containerRef.current, {
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
              if (isMountedRef.current && stableOnReady.current) {
                stableOnReady.current(event);
              }
            },
            onStateChange: (event) => {
              if (isMountedRef.current && stableOnStateChange.current) {
                stableOnStateChange.current(event);
              }
            },
            onError: (event) => {
              if (isMountedRef.current && stableOnError.current) {
                stableOnError.current(event);
              }
            },
          },
        });

        playerRef.current = player;
      } catch (error) {
        if (isMountedRef.current && stableOnError.current) {
          stableOnError.current({ data: error.message });
        }
      }
    });

    return () => {
      destroyed = true;
      isMountedRef.current = false;
      if (playerRef.current) {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
        playerRef.current = null;
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (!playerRef.current || !playerRef.current.playVideo) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume && volume !== undefined) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  if (!videoId) {
    return null;
  }

  return (
    <PlayerContainer aria-hidden="true">
      <div ref={containerRef} />
    </PlayerContainer>
  );
};

export default YouTubePlayer;
