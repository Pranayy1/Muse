import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { 
  FaPlay, 
  FaPause, 
  FaStepBackward, 
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';
import YouTubePlayer from './YouTubePlayer';
import { decodeHTML } from '../utils/helpers';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 15px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0 -4px 30px rgba(56, 189, 248, 0.2);
  border-top: 1px solid rgba(56, 189, 248, 0.3);

  @media (max-width: 768px) {
    padding: 12px 15px;
    gap: 10px;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 300px;
  min-width: 0;

  @media (max-width: 768px) {
    max-width: 200px;
  }

  @media (max-width: 480px) {
    max-width: 120px;
  }
`;

const TrackImage = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const TrackDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const TrackArtist = styled.div`
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const PlayerControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 500px;

  @media (max-width: 768px) {
    gap: 8px;
    max-width: 400px;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ControlButton = styled.button`
  background: rgba(56, 189, 248, 0.2);
  border: 2px solid rgba(56, 189, 248, 0.4);
  color: #1e293b;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
  
  &:hover {
    color: white;
    background: rgba(56, 189, 248, 0.5);
    border-color: rgba(56, 189, 248, 0.8);
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(56, 189, 248, 0.5);
  }

  svg {
    font-size: 22px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  @media (max-width: 768px) {
    padding: 8px;

    svg {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    padding: 7px;

    svg {
      font-size: 18px;
    }
  }
`;

const PlayPauseButton = styled(ControlButton)`
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  border: 2px solid rgba(255, 255, 255, 0.9);
  color: white;
  width: 52px;
  height: 52px;
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.5);
  
  &:hover {
    background: linear-gradient(135deg, #0ea5e9, #38bdf8);
    border-color: white;
    transform: scale(1.2);
    box-shadow: 0 6px 20px rgba(56, 189, 248, 0.7);
  }

  svg {
    font-size: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 768px) {
    width: 46px;
    height: 46px;

    svg {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;

    svg {
      font-size: 20px;
    }
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const TimeDisplay = styled.span`
  font-size: 12px;
  color: #1e293b;
  min-width: 42px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 10px;
    min-width: 35px;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 5px;
  background: rgba(100, 116, 139, 0.3);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    height: 6px;
  }

  @media (max-width: 480px) {
    height: 4px;

    &:hover {
      height: 5px;
    }
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #0284c7);
  border-radius: 10px;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 150px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    display: none;
  }
`;

const VolumeButton = styled.button`
  background: rgba(56, 189, 248, 0.2);
  border: 2px solid rgba(56, 189, 248, 0.4);
  color: #1e293b;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
  
  &:hover {
    background: rgba(56, 189, 248, 0.5);
    border-color: rgba(56, 189, 248, 0.8);
    color: white;
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(56, 189, 248, 0.5);
  }
  
  svg {
    font-size: 22px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #38bdf8;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #38bdf8;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const Player = ({ track, isPlaying, onPlay, onPause, onNext, onPrevious }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const volumeRef = useRef(100);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const hasTriggeredNextRef = useRef(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [track?.id]);

  const clearProgressInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearProgressInterval();

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const p = playerRef.current;
        if (p && typeof p.getCurrentTime === 'function' && typeof p.getDuration === 'function') {
          const currentTime = p.getCurrentTime();
          const duration = p.getDuration();
          setCurrentTime(currentTime);
          if (duration && duration !== Infinity) {
            setDuration(duration);
          }
        }
      }, 1000);
    }

    return () => {
      clearProgressInterval();
    };
  }, [isPlaying, clearProgressInterval]);

  const handlePlayerReady = useCallback((event) => {
    hasTriggeredNextRef.current = false;
    const ytPlayer = event.target;
    playerRef.current = ytPlayer;
    const dur = ytPlayer.getDuration();
    setDuration(dur);

    if (isPlaying) {
      ytPlayer.playVideo();
    }
  }, [isPlaying]);

  const handleStateChange = useCallback((event) => {
    const playerState = event.data;
    if (playerState === 0 && !hasTriggeredNextRef.current) {
      hasTriggeredNextRef.current = true;
      clearProgressInterval();
      onNext();
    }
  }, [onNext, clearProgressInterval]);

  const handleError = useCallback((event) => {
    console.error('YouTube Player error:', event.data);
    clearProgressInterval();
    onPause();
  }, [onPause, clearProgressInterval]);

  const handleProgressClick = useCallback((e) => {
    const p = playerRef.current;
    if (p && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      p.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  }, [duration]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    volumeRef.current = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (prev) {
        const saved = volumeRef.current;
        setVolume(saved > 0 ? saved : 50);
      } else {
        setVolume(v => {
          volumeRef.current = v;
          return 0;
        });
      }
      return !prev;
    });
  }, []);

  if (!track) return null;

  return (
    <PlayerContainer>
      <YouTubePlayer
        videoId={track.id}
        isPlaying={isPlaying}
        onReady={handlePlayerReady}
        onStateChange={handleStateChange}
        onError={handleError}
        volume={volume}
      />
      
      <TrackInfo>
        <TrackImage
          src={imageError ? undefined : track.thumbnail}
          alt={decodeHTML(track.title)}
          onError={() => setImageError(true)}
        />
        <TrackDetails>
          <TrackTitle>{decodeHTML(track.title)}</TrackTitle>
          <TrackArtist>{decodeHTML(track.channelTitle)}</TrackArtist>
        </TrackDetails>
      </TrackInfo>

      <PlayerControls>
        <ControlButtons>
          <ControlButton onClick={onPrevious} aria-label="Previous track">
            <FaStepBackward />
          </ControlButton>
          
          <PlayPauseButton onClick={isPlaying ? onPause : onPlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayPauseButton>
          
          <ControlButton onClick={onNext} aria-label="Next track">
            <FaStepForward />
          </ControlButton>
        </ControlButtons>

        <ProgressSection>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <ProgressBar onClick={handleProgressClick}>
            <ProgressFill progress={duration > 0 ? (currentTime / duration) * 100 : 0} />
          </ProgressBar>
          <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        </ProgressSection>
      </PlayerControls>

      <VolumeSection>
        <VolumeButton onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </VolumeButton>
        <VolumeSlider
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
      </VolumeSection>
    </PlayerContainer>
  );
};

export default Player;

