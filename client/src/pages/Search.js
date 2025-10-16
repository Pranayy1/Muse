import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaPlay, FaPause, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { searchSongs } from '../services/api';

const SearchContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchHeader = styled.div`
  margin-bottom: 30px;
`;

const SearchTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
`;

const SearchInputContainer = styled.div`
  position: relative;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: #1db954;
    box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
`;

const ResultsSection = styled.div`
  margin-top: 30px;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ResultsCount = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  
  option {
    background: #282828;
    color: white;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  background: #1db954;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1ed760;
    transform: scale(1.1);
  }
  
  svg {
    font-size: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButtonSmall = styled.button`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    font-size: 14px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
  font-size: 16px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
`;

const NoResultsIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const NoResultsTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  color: white;
`;

const NoResultsText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const { playTrack, addToPlaylist } = useMusic();

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchSongs(searchQuery, 20);
      setResults(response.videos);
    } catch (err) {
      setError('Failed to search songs');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  const handleAddToPlaylist = (track) => {
    addToPlaylist(track);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // In a real app, you would re-sort or re-fetch results
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Search</SearchTitle>
        <SearchInputContainer>
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </SearchInputContainer>
      </SearchHeader>

      {loading && (
        <LoadingSpinner>Searching for songs...</LoadingSpinner>
      )}

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {!loading && !error && results.length > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsCount>
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </ResultsCount>
            <SortSelect value={sortBy} onChange={handleSortChange}>
              <option value="relevance">Most Relevant</option>
              <option value="date">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="viewCount">Most Viewed</option>
            </SortSelect>
          </ResultsHeader>
          
          <ResultsGrid>
            {results.map((song) => (
              <ResultCard key={song.id} onClick={() => handlePlayTrack(song)}>
                <CardImage src={song.thumbnail} alt={song.title} />
                <CardTitle>{song.title}</CardTitle>
                <CardSubtitle>{song.channelTitle}</CardSubtitle>
                <CardActions>
                  <PlayButton onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTrack(song);
                  }}>
                    <FaPlay />
                  </PlayButton>
                  <ActionButtons>
                    <ActionButtonSmall onClick={(e) => {
                      e.stopPropagation();
                      handleAddToPlaylist(song);
                    }}>
                      <FaHeart />
                    </ActionButtonSmall>
                    <ActionButtonSmall onClick={(e) => e.stopPropagation()}>
                      <FaEllipsisH />
                    </ActionButtonSmall>
                  </ActionButtons>
                </CardActions>
              </ResultCard>
            ))}
          </ResultsGrid>
        </ResultsSection>
      )}

      {!loading && !error && query && results.length === 0 && (
        <NoResults>
          <NoResultsIcon>🔍</NoResultsIcon>
          <NoResultsTitle>No results found</NoResultsTitle>
          <NoResultsText>
            Try searching for something else or check your spelling.
          </NoResultsText>
        </NoResults>
      )}

      {!loading && !error && !query && (
        <NoResults>
          <NoResultsIcon>🎵</NoResultsIcon>
          <NoResultsTitle>Start searching</NoResultsTitle>
          <NoResultsText>
            Enter a song name, artist, or album to find music you love.
          </NoResultsText>
        </NoResults>
      )}
    </SearchContainer>
  );
};

export default Search;
