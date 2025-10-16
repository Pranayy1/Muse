import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaHeart, FaEllipsisH, FaFire } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { getTrendingSongs } from '../services/api';

const TrendingContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TrendingHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const TrendingTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const TrendingSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const FilterTab = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#1ed760' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const TrendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const TrendingCard = styled.div`
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
  height: 160px;
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
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
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

const formatViewCount = (count) => {
  if (!count) return '0 views';
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
};

const formatLikeCount = (count) => {
  if (!count) return '0 likes';
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M likes`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K likes`;
  }
  return `${num} likes`;
};

const Trending = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { playTrack, addToPlaylist } = useMusic();

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        setLoading(true);
        const response = await getTrendingSongs(24);
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

  const handleAddToPlaylist = (track) => {
    addToPlaylist(track);
  };

  const filteredSongs = trendingSongs.filter(song => {
    if (activeFilter === 'all') return true;
    // In a real app, you would filter by genre, language, etc.
    return true;
  });

  if (loading) {
    return (
      <TrendingContainer>
        <LoadingSpinner>Loading trending songs...</LoadingSpinner>
      </TrendingContainer>
    );
  }

  if (error) {
    return (
      <TrendingContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </TrendingContainer>
    );
  }

  return (
    <TrendingContainer>
      <TrendingHeader>
        <TrendingTitle>
          <FaFire />
          Trending Now
        </TrendingTitle>
        <TrendingSubtitle>
          The most popular songs in India right now
        </TrendingSubtitle>
        <FilterTabs>
          <FilterTab 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterTab>
          <FilterTab 
            active={activeFilter === 'bollywood'} 
            onClick={() => setActiveFilter('bollywood')}
          >
            Bollywood
          </FilterTab>
          <FilterTab 
            active={activeFilter === 'punjabi'} 
            onClick={() => setActiveFilter('punjabi')}
          >
            Punjabi
          </FilterTab>
          <FilterTab 
            active={activeFilter === 'tamil'} 
            onClick={() => setActiveFilter('tamil')}
          >
            Tamil
          </FilterTab>
        </FilterTabs>
      </TrendingHeader>

      <TrendingGrid>
        {filteredSongs.map((song, index) => (
          <TrendingCard key={song.id} onClick={() => handlePlayTrack(song)}>
            <CardImage src={song.thumbnail} alt={song.title} />
            <CardTitle>#{index + 1} {song.title}</CardTitle>
            <CardSubtitle>{song.channelTitle}</CardSubtitle>
            <CardStats>
              <StatItem>
                👁️ {formatViewCount(song.viewCount)}
              </StatItem>
              <StatItem>
                ❤️ {formatLikeCount(song.likeCount)}
              </StatItem>
            </CardStats>
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
          </TrendingCard>
        ))}
      </TrendingGrid>
    </TrendingContainer>
  );
};

export default Trending;
