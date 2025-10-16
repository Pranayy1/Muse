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

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentTrack(playlist[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentTrack(playlist[currentIndex - 1]);
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
              onPlay={playTrack}
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
