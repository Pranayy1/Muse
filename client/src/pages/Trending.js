import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { getTrendingSongs } from '../services/api';

const Trending = () => {
  const { playTrack } = useMusic();
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        setLoading(true);
        const response = await getTrendingSongs(20);
        setTrendingSongs(response.videos);
      } catch (err) {
        setError('Failed to load trending songs');
        console.error('Error fetching trending songs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  return <div>Trending Component</div>;
};

export default Trending;

