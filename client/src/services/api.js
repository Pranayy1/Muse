import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://muse-backend-t5ty.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Search for songs
export const searchSongs = async (query, maxResults = 10) => {
  try {
    const response = await api.get('/search', {
      params: { q: query, maxResults }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Get trending songs
export const getTrendingSongs = async (maxResults = 20) => {
  try {
    const response = await api.get('/trending', {
      params: { maxResults }
    });
    return response.data;
  } catch (error) {
    console.error('Trending songs error:', error);
    throw error;
  }
};

// Get video details
export const getVideoDetails = async (videoId) => {
  try {
    const response = await api.get(`/search/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Video details error:', error);
    throw error;
  }
};

// Get audio stream info
export const getAudioStream = async (videoId) => {
  try {
    const response = await api.get(`/audio/stream/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Audio stream error:', error);
    throw error;
  }
};

// Get video info for player
export const getVideoInfo = async (videoId) => {
  try {
    const response = await api.get(`/audio/info/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Video info error:', error);
    throw error;
  }
};

export default api;
