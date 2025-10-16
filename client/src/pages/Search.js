import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlay, FaHeart } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { searchSongs } from '../services/api';

const Search = () => {
  const { playTrack } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const response = await searchSongs(searchQuery, 20);
      setSearchResults(response.videos);
    } catch (err) {
      setError('Failed to search songs');
      console.error('Error searching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  return <div>Search Component</div>;
};

export default Search;

