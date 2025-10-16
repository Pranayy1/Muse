const express = require('express');
const axios = require('axios');
const router = express.Router();

const config = require('../config');
const YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;

// Get trending music videos in India
router.get('/', async (req, res) => {
  try {
    const { maxResults = 20 } = req.query;

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'IN', // India
        videoCategoryId: '10', // Music category
        maxResults: maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({ videos });
  } catch (error) {
    console.error('Trending videos error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get trending videos' });
  }
});

// Get trending by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { maxResults = 20 } = req.query;

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'IN',
        videoCategoryId: categoryId,
        maxResults: maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({ videos });
  } catch (error) {
    console.error('Category trending error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get category trending videos' });
  }
});

module.exports = router;
