const isGooglebot = (userAgent = '') => {
  const ua = userAgent.toLowerCase();
  return ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('facebookexternalhit') ||
    ua.includes('twitterbot') || ua.includes('linkedinbot') || ua.includes('whatsapp') ||
    ua.includes('telegrambot') || ua.includes('slackbot') || ua.includes('discordbot') ||
    ua.includes('applebot') || ua.includes('duckduckbot');
};

module.exports = async (req, res) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  if (!API_BASE_URL) {
    console.error('REACT_APP_API_BASE_URL is not set in Vercel environment variables.');
  }

  const userAgent = req.headers['user-agent'] || '';
  const { username, slug } = req.query;
  const path = req.url.split('?')[0];

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const canonicalUrl = `${protocol}://${host}${path}`;

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
  let image = `https://www.socialswap.in/images/logo.webp`;
  let extraBodyContent = '';
  let blogData = null;

  try {
    if (API_BASE_URL) {
      if (path.startsWith('/channel/') && username) {
        const rawUsername = username.trim();
        const resApi = await fetch(`${API_BASE_URL}/channels/username/${encodeURIComponent(rawUsername)}`);
        if (resApi.ok) {
          const data = await resApi.json();
          const channel = data.channel || data;
          if (channel && channel.name) {
            title = `Buy ${channel.name} YouTube Channel | SocialSwap`;
            description = `Buy the ${channel.name} YouTube channel with ${channel.subscriberCount || 0} subscribers on SocialSwap.`;
            image = channel.logoUrl || (channel.imageUrls && channel.imageUrls[0]) || image;
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
          blogData = data.blog || data;
          if (blogData && blogData.title) {
            title = blogData.metaTitle || `${blogData.title} | SocialSwap`;
            description = blogData.metaDescription || blogData.excerpt || blogData.title;
            image = blogData.ogImage || blogData.imageUrl || image;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic OG data:', error.message);
  }

  // Clean existing metadata tags
  let modifiedHtml = html;
  modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:title".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:description".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta name="description".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:image".*?>/gi, '');
  modifiedHtml = modifiedHtml.replace(/<meta property="og:url".*?>/gi, '');

  // Build OG + SEO tags
  const newTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${blogData ? 'article' : 'website'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${canonicalUrl}" />
    ${blogData && blogData.createdAt ? `<meta property="article:published_time" content="${new Date(blogData.createdAt).toISOString()}" />` : ''}
    ${blogData && blogData.updatedAt ? `<meta property="article:modified_time" content="${new Date(blogData.updatedAt).toISOString()}" />` : ''}
  `;

  modifiedHtml = modifiedHtml.replace('</head>', `${newTags}\n</head>`);

  // For crawlers: inject readable static content in <body> so Googlebot can index it
  // This does NOT affect normal user experience (React will hydrate and replace it)
  if (isGooglebot(userAgent) && blogData && blogData.title) {
    const strippedContent = (blogData.content || '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    extraBodyContent = `
      <div id="seo-static-content" style="display:none">
        <h1>${blogData.title}</h1>
        <p>${description}</p>
        ${blogData.category ? `<p>Category: ${blogData.category}</p>` : ''}
        <div>${strippedContent}</div>
      </div>
    `;
    modifiedHtml = modifiedHtml.replace('<div id="root"></div>', `<div id="root"></div>${extraBodyContent}`);
  }

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3600');
  res.status(200).send(modifiedHtml);
};
