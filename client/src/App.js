import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Player from './components/Player';
import { MusicProvider } from './services/MusicContext';
import { searchSongs } from './services/api';

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
  const isMountedRef = useRef(true);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const playTrack = useCallback((track, trackList = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    if (trackList.length > 0) {
      const index = trackList.findIndex(t => t.id === track.id);
      const newIndex = index >= 0 ? index : 0;
      setCurrentIndex(newIndex);
      currentIndexRef.current = newIndex;
      setPlaylist(trackList);
    } else {
      setPlaylist(prev => {
        const existingIndex = prev.findIndex(t => t.id === track.id);
        if (existingIndex >= 0) {
          setCurrentIndex(existingIndex);
          currentIndexRef.current = existingIndex;
          return prev;
        }
        const newIndex = prev.length;
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;
        return [...prev, track];
      });
    }
  }, []);

  const resumePlayback = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const getRandomTrackFromSameArtist = useCallback(async () => {
    if (!currentTrack) return null;

    try {
      const currentArtist = currentTrack.channelTitle;
      const searchQuery = currentArtist + ' songs';
      const response = await searchSongs(searchQuery, 20);

      if (response && response.videos && response.videos.length > 0) {
        const sameArtistTracks = response.videos.filter(track => {
          const trackArtist = track.channelTitle;
          return trackArtist === currentArtist && track.id !== currentTrack.id;
        });

        if (sameArtistTracks.length > 0) {
          const randomIndex = Math.floor(Math.random() * sameArtistTracks.length);
          return sameArtistTracks[randomIndex];
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }, [currentTrack]);

  const nextTrack = useCallback(async () => {
    if (!isMountedRef.current) return;

    const randomTrack = await getRandomTrackFromSameArtist();

    if (!isMountedRef.current) return;

    if (randomTrack) {
      setPlaylist(prev => {
        const existingIndex = prev.findIndex(t => t.id === randomTrack.id);
        if (existingIndex >= 0) {
          setCurrentIndex(existingIndex);
          currentIndexRef.current = existingIndex;
          setCurrentTrack(randomTrack);
          setIsPlaying(true);
          return prev;
        }
        const newIndex = prev.length;
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;
        setCurrentTrack(randomTrack);
        setIsPlaying(true);
        return [...prev, randomTrack];
      });
    } else {
      const idx = currentIndexRef.current;
      if (idx < playlist.length - 1) {
        const newIndex = idx + 1;
        setCurrentTrack(playlist[newIndex]);
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;
        setIsPlaying(true);
      }
    }
  }, [getRandomTrackFromSameArtist, playlist]);

  const previousTrack = useCallback(() => {
    if (!isMountedRef.current) return;

    const idx = currentIndexRef.current;
    if (idx > 0) {
      const newIndex = idx - 1;
      setCurrentTrack(playlist[newIndex]);
      setCurrentIndex(newIndex);
      currentIndexRef.current = newIndex;
      setIsPlaying(true);
    }
  }, [playlist]);

  const musicContextValue = useMemo(() => ({
    currentTrack,
    isPlaying,
    playlist,
    currentIndex,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack
  }), [currentTrack, isPlaying, playlist, currentIndex, playTrack, pauseTrack, nextTrack, previousTrack]);

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
