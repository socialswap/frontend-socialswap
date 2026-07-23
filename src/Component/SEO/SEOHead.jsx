import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'SocialSwap';
const BASE_URL = 'https://www.socialswap.in';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-default.jpg`;

const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  structuredData,
  article,
  breadcrumbs,
  faqSchema,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - India's #1 YouTube Channel Marketplace`;
  const imageUrl = ogImage || DEFAULT_OG_IMAGE;
  const canonical =
    canonicalUrl ||
    (typeof window !== 'undefined'
      ? `${BASE_URL}${window.location.pathname}`
      : BASE_URL);

  // Build BreadcrumbList JSON-LD
  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          ...(crumb.url ? { item: `${BASE_URL}${crumb.url}` } : {}),
        })),
      }
    : null;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Article-specific OG */}
      {article && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article && (
        <meta property="article:author" content={article.author} />
      )}
      {article &&
        article.tags &&
        article.tags.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
