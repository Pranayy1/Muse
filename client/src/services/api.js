import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://muse-backend-t5ty.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(error);
  }
);

export const searchSongs = async (query, maxResults = 10) => {
  const response = await api.get('/search', {
    params: { q: query, maxResults }
  });
  return response.data;
};

export const getTrendingSongs = async (maxResults = 20) => {
  const response = await api.get('/trending', {
    params: { maxResults }
  });
  return response.data;
};

export default api;
