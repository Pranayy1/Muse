import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Player from './components/Player';
import { MusicProvider } from './services/MusicContext';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
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
          <Sidebar />
          <MainContent>
            <Header />
            <ContentArea>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/trending" element={<Trending />} />
              </Routes>
            </ContentArea>
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
          </MainContent>
        </AppContainer>
      </Router>
    </MusicProvider>
  );
}

export default App;
