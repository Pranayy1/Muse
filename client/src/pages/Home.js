import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { useMusic } from '../services/MusicContext';
import { getTrendingSongs } from '../services/api';

// Utility function to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const HomeContainer = styled.div`
  width: 100%;
`;

const WelcomeSection = styled.div`
  margin-bottom: 50px;
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    margin-bottom: 30px;
    padding: 30px 15px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.6s ease;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 18px;
  color: #64748b;
  margin-bottom: 10px;
  animation: fadeInUp 0.6s ease 0.2s both;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Section = styled.div`
  margin-bottom: 50px;

  @media (max-width: 768px) {
    margin-bottom: 35px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #1e293b;
  position: relative;
  padding-bottom: 10px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #38bdf8, #0284c7);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const Grid = styled.div`
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

const Card = styled.div`
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
    box-shadow: 0 12px 30px rgba(56, 189, 248, 0.3);
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
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.2);

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

const Home = () => {
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
        <WelcomeTitle> Welcome to Muse</WelcomeTitle>
        <WelcomeSubtitle>
          Discover and enjoy millions of songs powered by YouTube
        </WelcomeSubtitle>
      </WelcomeSection>

      <Section>
        <SectionTitle> Trending Now</SectionTitle>
        <Grid>
          {trendingSongs.map((song) => (
            <Card key={song.id} onClick={() => handlePlayTrack(song)}>
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
                  <ActionButtonSmall onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <FaHeart />
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

