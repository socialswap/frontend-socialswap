module.exports = async (req, res) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  if (!API_BASE_URL) {
    console.error('REACT_APP_API_BASE_URL is not set in Vercel environment variables.');
  }

  const { username, slug } = req.query;
  const path = req.url.split('?')[0];

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  let html = `<!DOCTYPE html><html><head><title>SocialSwap</title></head><body><div id="root"></div></body></html>`;
  try {
    const htmlRes = await fetch(`${protocol}://${host}/index.html`);
    if (htmlRes.ok) {
      html = await htmlRes.text();
    }
  } catch(e) {
    console.error('Failed to fetch base index.html:', e.message);
  }

  let title = 'SocialSwap';
  let description = 'Buy and sell YouTube channels safely on SocialSwap.';
  let image = `https://${host}/images/logo.webp`;
  let url = `${protocol}://${host}${req.url}`;

  try {
    if (API_BASE_URL) {
      if (path.startsWith('/channel/') && username) {
        const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
        const resApi = await fetch(`${API_BASE_URL}/channels/username/${cleanUsername}`);
        if (resApi.ok) {
          const data = await resApi.json();
          const channel = data.channel || data;
          if (channel && channel.name) {
            title = `Buy ${channel.name} YouTube Channel | SocialSwap`;
            description = `Buy the ${channel.name} YouTube channel with ${channel.subscriberCount || 0} subscribers on SocialSwap.`;
            image = channel.bannerImage || channel.thumbnail || image;
          }
        }
      } else if (path.startsWith('/userprofile/') && username) {
        const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
        const resApi = await fetch(`${API_BASE_URL}/users/profile/${cleanUsername}`);
        if (resApi.ok) {
          const data = await resApi.json();
          const user = data.user;
          if (user && user.name) {
            title = `${user.name}'s Profile | SocialSwap`;
            description = `Check out ${user.name}'s profile on SocialSwap.`;
            image = user.avatar || image;
          }
        }
      } else if (path.startsWith('/blogs/') && slug) {
        const resApi = await fetch(`${API_BASE_URL}/blogs/${slug}`);
        if (resApi.ok) {
          const data = await resApi.json();
          const blog = data.blog || data;
          if (blog && blog.title) {
            title = `${blog.title} | SocialSwap`;
            description = blog.seoDescription || blog.excerpt || blog.title;
            image = blog.coverImage || blog.image || image;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic OG data:', error.message);
  }

  // Clean existing metadata
  let modifiedHtml = html;
  modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:title".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:description".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta name="description".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:image".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:url".*?>/gi, '');

  // Inject dynamic tags
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

  modifiedHtml = modifiedHtml.replace('</head>', `${newTags}\n</head>`);

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(modifiedHtml);
};
