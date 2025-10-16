import React, { useState, useEffect } from 'react';
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

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  padding: 15px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(29, 185, 84, 0.3);

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
  color: white;
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
  color: rgba(255, 255, 255, 0.7);
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
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  svg {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    padding: 6px;

    svg {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 5px;

    svg {
      font-size: 14px;
    }
  }
`;

const PlayPauseButton = styled(ControlButton)`
  background: linear-gradient(135deg, #1db954, #1ed760);
  color: white;
  width: 45px;
  height: 45px;
  
  &:hover {
    background: linear-gradient(135deg, #1ed760, #1fdf64);
    transform: scale(1.1);
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;

    svg {
      font-size: 16px;
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
  color: rgba(255, 255, 255, 0.8);
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
  background: rgba(255, 255, 255, 0.2);
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
  background: linear-gradient(90deg, #1db954, #1ed760);
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
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  svg {
    font-size: 18px;
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
    background: #1db954;
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
    background: #1db954;
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
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [player, setPlayer] = useState(null);

  const handlePlayerReady = (event) => {
    console.log('YouTube Player Ready!');
    console.log('Track data:', track);
    console.log('Video ID:', track?.id);
    console.log('Is Playing:', isPlaying);
    
    setPlayer(event.target);
    const dur = event.target.getDuration();
    console.log('Video duration:', dur);
    setDuration(dur);
    
    // Start playing if isPlaying is true
    if (isPlaying) {
      console.log('Auto-starting playback');
      event.target.playVideo();
    }
  };

  const handleStateChange = (event) => {
    const playerState = event.data;
    console.log('Player state changed:', playerState);
    const states = {
      '-1': 'unstarted',
      '0': 'ended',
      '1': 'playing',
      '2': 'paused',
      '3': 'buffering',
      '5': 'cued'
    };
    console.log('State name:', states[playerState]);
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    if (playerState === 0) { // ended
      onNext();
    }
  };

  const handleProgress = (currentTime, duration) => {
    setCurrentTime(currentTime);
    if (duration && duration !== Infinity) {
      setDuration(duration);
    }
  };

  useEffect(() => {
    console.log('Play/Pause effect triggered:', { isPlaying, player: !!player });
    if (player) {
      if (isPlaying) {
        console.log('Calling playVideo()');
        player.playVideo();
      } else {
        console.log('Calling pauseVideo()');
        player.pauseVideo();
      }
    }
  }, [isPlaying, player]);

  useEffect(() => {
    if (player) {
      player.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted, player]);

  const handleProgressClick = (e) => {
    if (player && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!track) return null;

  return (
    <PlayerContainer>
      <YouTubePlayer
        videoId={track.id}
        isPlaying={isPlaying}
        onReady={handlePlayerReady}
        onStateChange={handleStateChange}
        onProgress={handleProgress}
        volume={isMuted ? 0 : volume}
      />
      
      <TrackInfo>
        <TrackImage src={track.thumbnail} alt={track.title} />
        <TrackDetails>
          <TrackTitle>{track.title}</TrackTitle>
          <TrackArtist>{track.channelTitle}</TrackArtist>
        </TrackDetails>
      </TrackInfo>

      <PlayerControls>
        <ControlButtons>
          <ControlButton onClick={onPrevious}>
            <FaStepBackward />
          </ControlButton>
          
          <PlayPauseButton onClick={isPlaying ? onPause : onPlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayPauseButton>
          
          <ControlButton onClick={onNext}>
            <FaStepForward />
          </ControlButton>
        </ControlButtons>

        <ProgressSection>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <ProgressBar onClick={handleProgressClick}>
            <ProgressFill progress={(currentTime / duration) * 100 || 0} />
          </ProgressBar>
          <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        </ProgressSection>
      </PlayerControls>

      <VolumeSection>
        <VolumeButton onClick={toggleMute}>
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </VolumeButton>
        <VolumeSlider
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </VolumeSection>
    </PlayerContainer>
  );
};

export default Player;
