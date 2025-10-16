# Muse - YouTube Music Streaming App

A Spotify-like music streaming web application built with the MERN stack, powered by YouTube Data API v3.

🌐 **Live Demo**: [https://pranayy1.github.io/Muse](https://pranayy1.github.io/Muse)

## Features

- 🎵 **Music Search**: Search for songs, artists, and albums using YouTube Data API
- 🔥 **Trending Songs**: View trending music videos in the Indian region
- ▶️ **Audio Player**: Play, pause, skip, and control music playback with YouTube embed
- 🎨 **Modern UI**: Beautiful, responsive design inspired by Spotify
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎯 **Real-time Controls**: Forward/backward buttons, volume control, and progress bar

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **YouTube Data API v3** - Music data source
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library
- **Axios** - HTTP client
- **YouTube IFrame Player** - Audio playback

## Deployment

### Frontend (GitHub Pages) ✅
The frontend is successfully deployed on GitHub Pages:

**Live URL**: [https://pranayy1.github.io/Muse](https://pranayy1.github.io/Muse)

To redeploy after making changes:
```bash
cd client
npm run build
npm run deploy
```

The deployment uses the `gh-pages` npm package to automatically build and deploy the React app to the `gh-pages` branch.

### Backend (Local Development)
For local development, the backend runs on port 5000:
```bash
npm start
```

### Backend (Production Deployment)
For production, deploy the backend to a cloud service:
- **Render**: [https://render.com](https://render.com)
- **Heroku**: [https://heroku.com](https://heroku.com)
- **Railway**: [https://railway.app](https://railway.app)
- **Vercel**: [https://vercel.com](https://vercel.com)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- YouTube Data API v3 key

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd spotify-clone-mern
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
NODE_ENV=development
PORT=5000
```

4. Start the backend server:
```bash
npm run server
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

### Running Both Servers

From the root directory, you can run both servers simultaneously:
```bash
npm run dev
```

## API Endpoints

### Search
- `GET /api/search?q={query}&maxResults={number}` - Search for songs
- `GET /api/search/{videoId}` - Get video details

### Trending
- `GET /api/trending?maxResults={number}` - Get trending songs in India
- `GET /api/trending/category/{categoryId}` - Get trending by category

### Audio
- `GET /api/audio/stream/{videoId}` - Get audio stream info
- `GET /api/audio/info/{videoId}` - Get video info for player

## Project Structure

```
spotify-clone-mern/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services and context
│   │   └── styles/        # Global styles
│   └── package.json
├── routes/                # Express routes
│   ├── search.js         # Search endpoints
│   ├── trending.js       # Trending endpoints
│   └── audio.js          # Audio endpoints
├── server.js             # Express server
├── package.json          # Backend dependencies
└── README.md
```

## Usage

1. **Home Page**: View trending songs and quick actions
2. **Search**: Search for specific songs, artists, or albums
3. **Trending**: Browse trending music videos in India
4. **Player**: Control playback with play/pause, skip, and volume controls

## Features in Detail

### Music Player
- Play/pause functionality
- Forward/backward navigation
- Progress bar with click-to-seek
- Volume control with mute option
- Shuffle and repeat modes
- Track information display

### Search Functionality
- Real-time search with YouTube Data API
- Filter results by relevance, date, rating, or view count
- Responsive search results grid
- Click to play functionality

### Trending Songs
- Fetches trending music videos from India
- Displays view counts and like counts
- Filter by categories (Bollywood, Punjabi, Tamil, etc.)
- Ranked by popularity

## YouTube Data API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## Limitations

- **Audio Streaming**: This demo uses YouTube embed URLs. For production, you would need to implement actual audio stream extraction using tools like `youtube-dl` or similar services.
- **Rate Limiting**: YouTube Data API has rate limits. The app includes basic rate limiting middleware.
- **CORS**: Make sure to configure CORS properly for production deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- YouTube Data API v3 for music data
- Spotify for UI/UX inspiration
- React and Express.js communities
