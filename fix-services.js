const fs = require('fs');

let content = fs.readFileSync('src/Pages/Services/ServicesPage.jsx', 'utf8');

if (!content.includes('import SEOHead')) {
  content = content.replace(
    "import axiosInstance, { api } from '../../API/api';",
    "import axiosInstance, { api } from '../../API/api';\nimport SEOHead from '../../Component/SEO/SEOHead';"
  );
}

if (!content.includes('<SEOHead')) {
  content = content.replace(
    '<div className="min-h-screen bg-transparent pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans relative">',
    '<div className="min-h-screen bg-transparent pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans relative">\n      <SEOHead title="Our Services | SocialSwap" description="Explore the professional services offered by SocialSwap." />'
  );
}

fs.writeFileSync('src/Pages/Services/ServicesPage.jsx', content);
console.log('Fixed ServicesPage.jsx');
