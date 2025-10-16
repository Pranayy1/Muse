const express = require('express');
const axios = require('axios');
const router = express.Router();

const config = require('../config');
const YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;

// Get audio stream URL (Note: This is a simplified approach)
// In a real application, you would need to use youtube-dl or similar tools
// to extract actual audio URLs, as YouTube doesn't provide direct audio URLs
router.get('/stream/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    // Get video details first
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = response.data.items[0];
    
    // For demo purposes, we'll return the video embed URL
    // In a real app, you'd need to use youtube-dl or similar to get actual audio stream
    const audioData = {
      videoId: videoId,
      title: video.snippet.title,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      duration: video.contentDetails.duration,
      thumbnail: video.snippet.thumbnails.medium.url,
      channelTitle: video.snippet.channelTitle
    };

    res.json({ audio: audioData });
  } catch (error) {
    console.error('Audio stream error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get audio stream' });
  }
});

// Get video info for player
router.get('/info/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = response.data.items[0];
    const videoInfo = {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium.url,
      channelTitle: video.snippet.channelTitle,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      publishedAt: video.snippet.publishedAt,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`
    };

    res.json({ video: videoInfo });
  } catch (error) {
    console.error('Video info error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get video info' });
  }
});

module.exports = router;
