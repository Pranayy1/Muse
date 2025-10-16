import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaPlay, 
  FaPause, 
  FaStepBackward, 
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaRedo
} from 'react-icons/fa';
import YouTubePlayer from './YouTubePlayer';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #1db954 0%, #1ed760 100%);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 300px;
`;

const TrackImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  justify-content: center;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  &.play-pause {
    background: white;
    color: #1db954;
    width: 40px;
    height: 40px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: scale(1.05);
    }
  }
  
  svg {
    font-size: ${props => props.size === 'large' ? '18px' : '14px'};
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 400px;
`;

const TimeDisplay = styled.span`
  font-size: 12px;
  color: white;
  min-width: 40px;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: white;
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 200px;
  justify-content: flex-end;
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    font-size: 16px;
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
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
      
      {/* Debug info */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        fontSize: '10px', 
        color: 'rgba(255,255,255,0.5)',
        background: 'rgba(0,0,0,0.5)',
        padding: '5px',
        borderRadius: '3px'
      }}>
        ID: {track.id} | Playing: {isPlaying ? 'YES' : 'NO'} | Player: {player ? 'READY' : 'NOT READY'}
      </div>
      
      <TrackInfo>
        <TrackImage src={track.thumbnail} alt={track.title} />
        <TrackDetails>
          <TrackTitle>{track.title}</TrackTitle>
          <TrackArtist>{track.channelTitle}</TrackArtist>
        </TrackDetails>
      </TrackInfo>

      <PlayerControls>
        <ControlButton onClick={() => setIsShuffled(!isShuffled)}>
          <FaRandom style={{ opacity: isShuffled ? 1 : 0.5 }} />
        </ControlButton>
        
        <ControlButton onClick={onPrevious}>
          <FaStepBackward />
        </ControlButton>
        
        <ControlButton 
          className="play-pause"
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </ControlButton>
        
        <ControlButton onClick={onNext}>
          <FaStepForward />
        </ControlButton>
        
        <ControlButton onClick={() => setIsRepeating(!isRepeating)}>
          <FaRedo style={{ opacity: isRepeating ? 1 : 0.5 }} />
        </ControlButton>
      </PlayerControls>

      <ProgressSection>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <ProgressBar onClick={handleProgressClick}>
          <ProgressFill progress={(currentTime / duration) * 100} />
        </ProgressBar>
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
      </ProgressSection>

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
