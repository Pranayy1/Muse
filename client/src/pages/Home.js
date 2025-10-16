import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { getTrendingSongs } from '../services/api';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #1db954, #1ed760);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.primary {
    background: #1db954;
    border-color: #1db954;
    
    &:hover {
      background: #1ed760;
      border-color: #1ed760;
    }
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
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
  height: 120px;
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

const Home = () => {
  const { playTrack, addToPlaylist } = useMusic();
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        setLoading(true);
        const response = await getTrendingSongs(12);
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

  if (loading) {
    return (
      <HomeContainer>
        <LoadingSpinner>Loading trending songs...</LoadingSpinner>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome to Spotify Clone</WelcomeTitle>
        <WelcomeSubtitle>
          Discover new music and enjoy your favorite tracks with our YouTube-powered music streaming app.
        </WelcomeSubtitle>
        <QuickActions>
          <ActionButton className="primary">Play Random</ActionButton>
          <ActionButton>Browse Genres</ActionButton>
          <ActionButton>Your Library</ActionButton>
        </QuickActions>
      </WelcomeSection>

      <Section>
        <SectionTitle>Trending Now in India</SectionTitle>
        <Grid>
          {trendingSongs.map((song) => (
            <Card key={song.id} onClick={() => handlePlayTrack(song)}>
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
            </Card>
          ))}
        </Grid>
      </Section>
    </HomeContainer>
  );
};

export default Home;
