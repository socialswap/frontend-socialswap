const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.socialswap.in/api';

// Fallback HTML if reading index.html fails
const getFallbackHtml = () => `<!DOCTYPE html><html><head><title>SocialSwap</title></head><body><div id="root"></div></body></html>`;

const injectOgTags = (html, title, description, image, url) => {
  let modifiedHtml = html;
  
  // Clean up existing tags
  modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/g, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:title" content=".*?"\s*\/?>/g, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:description" content=".*?"\s*\/?>/g, '');
  modifiedHtml = modifiedHtml.replace(/<meta name="description" content=".*?"\s*\/?>/g, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:image" content=".*?"\s*\/?>/g, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:url" content=".*?"\s*\/?>/g, '');

  const newTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  `;

  return modifiedHtml.replace('</head>', `${newTags}</head>`);
};

// Intercept Channel Route
app.get('/channel/:username', async (req, res, next) => {
  const { username } = req.params;
  const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/channels/username/${cleanUsername}`);
    const channel = response.data.channel || response.data;
    
    if (channel) {
      const title = `Buy ${channel.name} YouTube Channel | SocialSwap`;
      const description = `Buy the ${channel.name} YouTube channel with ${channel.subscriberCount} subscribers on SocialSwap. Verified marketplace for YouTubers.`;
      const image = channel.bannerImage || channel.thumbnail || 'https://www.socialswap.in/images/logo.webp';
      const url = `https://www.socialswap.in/channel/@${cleanUsername}`;

      const indexPath = path.resolve(__dirname, 'build', 'index.html');
      fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) return res.send(getFallbackHtml());
        const finalHtml = injectOgTags(htmlData, title, description, image, url);
        return res.send(finalHtml);
      });
      return;
    }
  } catch (error) {
    console.error('Error fetching channel for OG tags:', error.message);
  }
  
  // Fallback to normal if error
  next();
});

// Intercept User Profile Route
app.get('/userprofile/:username', async (req, res, next) => {
  const { username } = req.params;
  const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile/${cleanUsername}`);
    const user = response.data.user;
    
    if (user) {
      const title = `${user.name}'s Profile | SocialSwap`;
      const description = `Check out ${user.name}'s profile on SocialSwap. Buy and sell YouTube channels safely.`;
      const image = user.avatar || 'https://www.socialswap.in/images/logo.webp';
      const url = `https://www.socialswap.in/userprofile/@${cleanUsername}`;

      const indexPath = path.resolve(__dirname, 'build', 'index.html');
      fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) return res.send(getFallbackHtml());
        const finalHtml = injectOgTags(htmlData, title, description, image, url);
        return res.send(finalHtml);
      });
      return;
    }
  } catch (error) {
    console.error('Error fetching user for OG tags:', error.message);
  }
  
  // Fallback to normal if error
  next();
});

// Serve static files from the build directory
app.use(express.static(path.resolve(__dirname, 'build'), { index: false }));

// Catch-all route to serve index.html for CSR navigation
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
