import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlay, FaHeart } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { searchSongs } from '../services/api';

// Utility function to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const SearchContainer = styled.div`
  width: 100%;
`;

const SearchHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const SearchTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 18px 25px 18px 60px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  color: #1e293b;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: #38bdf8;
    box-shadow: 0 0 0 4px rgba(29, 185, 84, 0.15);
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 16px 20px 16px 55px;
    font-size: 15px;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 20px;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 18px;
    font-size: 18px;
  }
`;

const ResultsSection = styled.div`
  margin-top: 50px;

  @media (max-width: 768px) {
    margin-top: 35px;
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ResultsCount = styled.p`
  color: #64748b;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.7);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(29, 185, 84, 0.1), rgba(30, 215, 96, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    border-color: rgba(29, 185, 84, 0.3);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 12px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    border-radius: 8px;
    margin-bottom: 12px;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1e293b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 44px;

  @media (max-width: 768px) {
    font-size: 14px;
    min-height: 40px;
  }
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 12px;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const PlayButton = styled.button`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #38bdf8, #0284c7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.4);
  
  &:hover {
    background: linear-gradient(135deg, #0284c7, #1fdf64);
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.6);
  }
  
  svg {
    font-size: 18px;
    margin-left: 2px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      font-size: 16px;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ActionButtonSmall = styled.button`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  svg {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;

    svg {
      font-size: 12px;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #64748b;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @media (max-width: 768px) {
    height: 200px;
    font-size: 16px;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #ff6b6b;
  font-size: 18px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 107, 0.3);

  @media (max-width: 768px) {
    padding: 40px 15px;
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  font-size: 18px;

  svg {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.3;
  }

  p {
    margin: 10px 0;
  }

  @media (max-width: 768px) {
    padding: 60px 15px;
    font-size: 16px;

    svg {
      font-size: 48px;
    }
  }
`;

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
    playTrack(track, searchResults);
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>🔍 Search Music</SearchTitle>
        <SearchInputContainer>
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search for songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchInputContainer>
      </SearchHeader>

      {loading && (
        <LoadingSpinner>🎵 Searching...</LoadingSpinner>
      )}

      {error && !loading && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {!loading && !error && hasSearched && searchResults.length === 0 && (
        <EmptyState>
          <FaSearch />
          <p>No results found for "{searchQuery}"</p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Try different keywords</p>
        </EmptyState>
      )}

      {!loading && !error && hasSearched && searchResults.length > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsCount>
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </ResultsCount>
          </ResultsHeader>
          <ResultsGrid>
            {searchResults.map((song) => (
              <ResultCard key={song.id} onClick={() => handlePlayTrack(song)}>
                <CardImage src={song.thumbnail} alt={decodeHTML(song.title)} />
                <CardTitle>{decodeHTML(song.title)}</CardTitle>
                <CardSubtitle>{decodeHTML(song.channelTitle)}</CardSubtitle>
                <CardActions>
                  <PlayButton onClick={(e) => {
                    e.stopPropagation();
                    handlePlayTrack(song);
                  }}>
                    <FaPlay />
                  </PlayButton>
                  <ActionButtons>
                    <ActionButtonSmall onClick={(e) => e.stopPropagation()}>
                      <FaHeart />
                    </ActionButtonSmall>
                  </ActionButtons>
                </CardActions>
              </ResultCard>
            ))}
          </ResultsGrid>
        </ResultsSection>
      )}

      {!hasSearched && !loading && (
        <EmptyState>
          <FaSearch />
          <p>Start searching for your favorite music</p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Type in the search box above</p>
        </EmptyState>
      )}
    </SearchContainer>
  );
};

export default Search;

