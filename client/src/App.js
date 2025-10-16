import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Player from './components/Player';
import { MusicProvider } from './services/MusicContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7ff 0%, #ffffff 50%, #f0f9ff 100%);
  background-attachment: fixed;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(125, 211, 252, 0.08) 0%, transparent 50%);
    pointer-events: none;
    animation: float 20s ease-in-out infinite;
    z-index: 0;
  }

  @keyframes float {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: ${props => props.hasPlayer ? '100px' : '0'};
  position: relative;
  z-index: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playTrack = (track, trackList = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // If a track list is provided, set up the playlist
    if (trackList.length > 0) {
      setPlaylist(trackList);
      const index = trackList.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else if (playlist.length === 0) {
      // If no track list and no existing playlist, add this track as the only one
      setPlaylist([track]);
      setCurrentIndex(0);
    } else {
      // Find the track in the existing playlist
      const index = playlist.findIndex(t => t.id === track.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  };

  const resumePlayback = () => {
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const getRandomTrackFromSameArtist = () => {
    if (!currentTrack || playlist.length === 0) return null;

    // Get current artist/channel
    const currentArtist = currentTrack.channelTitle || currentTrack.artist;
    
    // Filter songs from the same artist
    const sameArtistTracks = playlist.filter(track => {
      const trackArtist = track.channelTitle || track.artist;
      return trackArtist === currentArtist && track.id !== currentTrack.id;
    });

    // If there are songs from the same artist, pick a random one
    if (sameArtistTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * sameArtistTracks.length);
      const randomTrack = sameArtistTracks[randomIndex];
      const playlistIndex = playlist.findIndex(t => t.id === randomTrack.id);
      return { track: randomTrack, index: playlistIndex };
    }

    // If no other songs from same artist, pick any random song
    const otherTracks = playlist.filter(track => track.id !== currentTrack.id);
    if (otherTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherTracks.length);
      const randomTrack = otherTracks[randomIndex];
      const playlistIndex = playlist.findIndex(t => t.id === randomTrack.id);
      return { track: randomTrack, index: playlistIndex };
    }

    return null;
  };

  const nextTrack = () => {
    // Try to get a random track from the same artist
    const randomTrack = getRandomTrackFromSameArtist();
    
    if (randomTrack) {
      setCurrentIndex(randomTrack.index);
      setCurrentTrack(randomTrack.track);
      setIsPlaying(true);
      console.log('🎲 Playing random track from same artist:', randomTrack.track.title);
    } else if (currentIndex < playlist.length - 1) {
      // Fallback to sequential if no random track found
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(playlist[nextIndex]);
      setIsPlaying(true);
    }
  };

  const previousTrack = () => {
    // Try to get a random track from the same artist
    const randomTrack = getRandomTrackFromSameArtist();
    
    if (randomTrack) {
      setCurrentIndex(randomTrack.index);
      setCurrentTrack(randomTrack.track);
      setIsPlaying(true);
      console.log('🎲 Playing random track from same artist:', randomTrack.track.title);
    } else if (currentIndex > 0) {
      // Fallback to sequential if no random track found
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(playlist[prevIndex]);
      setIsPlaying(true);
    }
  };

  const addToPlaylist = (track) => {
    setPlaylist(prev => [...prev, track]);
  };

  const musicContextValue = {
    currentTrack,
    isPlaying,
    playlist,
    currentIndex,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    addToPlaylist,
    setPlaylist
  };

  return (
    <MusicProvider value={musicContextValue}>
      <Router>
        <AppContainer>
          <Header />
          <MainContent hasPlayer={!!currentTrack}>
            <ContentArea>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/trending" element={<Trending />} />
              </Routes>
            </ContentArea>
          </MainContent>
          {currentTrack && (
            <Player
              track={currentTrack}
              isPlaying={isPlaying}
              onPlay={resumePlayback}
              onPause={pauseTrack}
              onNext={nextTrack}
              onPrevious={previousTrack}
            />
          )}
        </AppContainer>
      </Router>
    </MusicProvider>
  );
}

export default App;
