# Deploying Backend to Render

This guide will help you deploy the backend Express server to Render.

## Prerequisites
- A GitHub account with this repository pushed
- A free Render account (sign up at https://render.com)

## Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started" or "Sign Up"
3. Sign up with your GitHub account for easy integration

## Step 2: Create New Web Service
1. After logging in, click "New +" button in the top right
2. Select "Web Service"
3. Connect your GitHub repository:
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select repository: `Pranayy1/Muse`

## Step 3: Configure Web Service
Fill in the following settings:

- **Name**: `muse-backend` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave empty (or use `.` if prompted)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Select "Free" (Free plan available)

## Step 4: Set Environment Variables
In the "Environment Variables" section, add:

1. Click "Add Environment Variable"
2. Add the following:
   - **Key**: `NODE_ENV`
     **Value**: `production`
   
   - **Key**: `YOUTUBE_API_KEY`
     **Value**: `AIzaSyAweoatxBo6mI4pUccJ33crj3ZpghZZKog`

## Step 5: Deploy
1. Click "Create Web Service" at the bottom
2. Render will start deploying your service
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll see a green "Live" status

## Step 6: Get Your Backend URL
- Your backend URL will be: `https://muse-backend.onrender.com` (or whatever name you chose)
- Copy this URL - you'll need it to update the frontend

## Step 7: Test Your Backend
Test the health endpoint:
```
https://your-service-name.onrender.com/api/health
```

You should see: `{"status":"OK","message":"Server is running"}`

## Important Notes

### Free Tier Limitations
- Free services spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds (cold start)
- 750 hours/month of usage (sufficient for most projects)

### CORS Configuration
The backend is already configured with CORS enabled for all origins, so your GitHub Pages frontend will work.

### API Endpoints
Once deployed, your endpoints will be:
- Health: `https://your-service.onrender.com/api/health`
- Search: `https://your-service.onrender.com/api/search?q=query`
- Trending: `https://your-service.onrender.com/api/trending`
- Audio: `https://your-service.onrender.com/api/audio/:videoId`

## Next Steps
After deployment completes:
1. Copy your Render backend URL
2. Update the frontend configuration (see instructions below)
3. Redeploy the frontend to GitHub Pages

---

# Update Frontend to Use Render Backend

After deploying to Render, update your frontend:

## Option 1: Update api.js directly (Simple)

Edit `client/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

Then rebuild and deploy:
```bash
cd client
npm run build
npm run deploy
```

## Option 2: Use Environment Variables (Recommended)

1. Create `client/.env.production`:
```
REACT_APP_API_URL=https://your-service-name.onrender.com/api
```

2. Rebuild and deploy:
```bash
cd client
npm run build
npm run deploy
```

## Verify Deployment
1. Visit https://pranayy1.github.io/Muse
2. Open browser console (F12)
3. Check for API calls to your Render URL
4. Test search and trending functionality
5. Try playing a song

## Troubleshooting

### Backend not responding
- Check Render dashboard for build/runtime errors
- Verify environment variables are set correctly
- Check Render logs for errors

### CORS errors
- Backend already has CORS enabled for all origins
- If issues persist, check Render logs

### Cold start delays
- Free tier services sleep after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Consider keeping service warm with uptime monitoring (optional)

### API Key issues
- Verify YOUTUBE_API_KEY environment variable is set in Render
- Check API key hasn't exceeded quota
- Visit Google Cloud Console to check API usage

## Support
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
