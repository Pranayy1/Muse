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
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  background-attachment: fixed;
  color: white;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: ${props => props.hasPlayer ? '100px' : '0'};
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
