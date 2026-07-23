import React from 'react';
import { Card, Carousel, Typography } from 'antd';
import { StarFilled, YoutubeFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const testimonials = [
  {
    name: "Aarav Singh",
    date: "2 months ago",
    content: "Selling my YouTube channel through SocialSwap was seamless. Shubham and his team handled everything with professionalism and transparency.",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/@ronislive18",
    badge: { icon: "🏆", label: "Top Seller", tone: "seller" },
    trustScore: 9.8
  },
  {
    name: "Young Mine",
    date: "1 month ago",
    content: "The buying process was incredibly smooth. Really happy with my purchase through SocialSwap!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@younggamer05",
    badge: { icon: "⭐", label: "Verified Buyer", tone: "buyer" },
    trustScore: 9.6
  },
  {
    name: "Anubhav Mishra",
    date: "2 months ago",
    content: "Great experience selling my channel. The team was very professional throughout.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@anubhavdefender100k",
    badge: { icon: "🏆", label: "Top Seller", tone: "seller" },
    trustScore: 9.7
  },
  {
    name: "Yash Vegad",
    date: "1 month ago",
    content: "Buying on SocialSwap was easy and quick. Shubham guided me throughout the process.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@littlesingham755",
    badge: { icon: "⭐", label: "Verified Buyer", tone: "buyer" },
    trustScore: 9.5
  },
  {
    name: "Shaurya Singh",
    date: "2 months ago",
    content: "The verification process made me feel secure in my purchase. Excellent service!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@shauryas_skits",
    badge: { icon: "⭐", label: "Verified Buyer", tone: "buyer" },
    trustScore: 9.4
  },
  {
    name: "Ansh Chauhan",
    date: "1 month ago",
    content: "SocialSwap provided a secure platform for selling my channel. Very satisfied!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@ansh_edits108",
    badge: { icon: "🏆", label: "Top Seller", tone: "seller" },
    trustScore: 9.6
  },
  {
    name: "Sanket Chaudhari",
    date: "2 months ago",
    content: "Found exactly what I was looking for at a fair price. Transaction was smooth and secure.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@anime7x3",
    badge: { icon: "⭐", label: "Verified Buyer", tone: "buyer" },
    trustScore: 9.5
  },
  {
    name: "Varun Sharma",
    date: "1 month ago",
    content: "Team SocialSwap made selling my channel stress-free. Their support was excellent!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@v2horror",
    badge: { icon: "🏅", label: "Community Star", tone: "community" },
    trustScore: 9.7
  },
  {
    name: "Anmol Verma",
    date: "3 months ago",
    content: "Excellent support throughout the entire buying process. Highly recommended!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@adgkingdom",
    badge: { icon: "⭐", label: "Verified Buyer", tone: "buyer" },
    trustScore: 9.6
  },
  {
    name: "Sumit Patil",
    date: "2 months ago",
    content: "The selling process was transparent and professional. Great platform!",
    rating: 5,
    youtubeUrl: "https://youtube.com/@gamingstargs19",
    badge: { icon: "🏆", label: "Top Seller", tone: "seller" },
    trustScore: 9.5
  },
  {
    name: "Mihir Patel",
    date: "1 month ago",
    content: "Very satisfied with my purchase. The team made everything easy and secure.",
    rating: 5,
    youtubeUrl: "https://youtube.com/@daxua_playz",
    badge: { icon: "⭐", label: "Verified Buyer", tone: "buyer" },
    trustScore: 9.4
  }
];

const badgeThemes = {
  seller: {
    background: "rgba(124, 58, 237, 0.15)",
    color: "#7C3AED"
  },
  buyer: {
    background: "rgba(217, 70, 239, 0.15)",
    color: "#D946EF"
  },
  community: {
    background: "rgba(59, 130, 246, 0.15)",
    color: "#3B82F6"
  }
};

const TestimonialCard = ({ name, date, content, rating, youtubeUrl, badge, trustScore }) => {
  const theme = badgeThemes[badge?.tone] || badgeThemes.buyer;

  return (
    <Card 
      className="testimonial-card mx-2 h-full transition-transform duration-300"
      variant="borderless"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="energy-line" />
      <div className="card-glow" />
      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Title level={4} className="!mb-0 !text-text-primary">{name}</Title>
              {badge && (
                <span
                  className="badge-chip"
                  style={{
                    background: theme.background,
                    color: theme.color,
                    borderColor: `${theme.color}33`
                  }}
                >
                  <span className="mr-1">{badge.icon}</span>
                  {badge.label}
                </span>
              )}
            </div>
            <Text className="text-xs uppercase tracking-wider text-text-muted">{date}</Text>
          </div>
          <div className="flex flex-col items-end gap-2">
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="youtube-orb animate--pulse"
            >
              <span className="youtube-pulse" />
              <YoutubeFilled className="text-xl text-white relative z-10" />
            </a>
            <div className="flex gap-1 star-row">
              {[...Array(rating)].map((_, i) => (
                <StarFilled key={i} className="text-yellow-400 star-icon" />
              ))}
            </div>
          </div>
        </div>
        <Text className="text-text-secondary leading-relaxed block mb-4">
          {content}
        </Text>
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span className="trust-meter">
            Trust Score
            <strong className="ml-2 text-text-primary">{trustScore.toFixed(1)}/10</strong>
          </span>
          <span className="card-accent-label">Verified</span>
        </div>
      </div>
    </Card>
  );
};

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="w-full py-20 testimonials-section bg-bg-primary text-text-primary transition-all duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
          >
            <Title level={2} className="text-center mb-12 gradient-heading text-text-primary">
              <span>What Our Users Say</span>
            </Title>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }}
          className="relative testimonials-carousel"
        >
          <style>{`
            .testimonials-section {
              position: relative;
              background: var(--bg-primary);
              overflow: hidden;
            }

            .testimonials-section::before {
              content: "";
              position: absolute;
              inset: 0;
              background-image: radial-gradient(circle at center, var(--glow-blue) 0%, transparent 60%);
              z-index: 0;
            }

            .testimonials-section::after {
              content: "";
              position: absolute;
              inset: 0;
              opacity: 0.05;
              background-size: 80px 80px;
              background-image:
                linear-gradient(transparent 79px, var(--border) 80px),
                linear-gradient(90deg, transparent 79px, var(--border) 80px);
              z-index: 0;
            }

            .testimonials-section > .container {
              position: relative;
              z-index: 1;
            }

            .gradient-heading span {
              background: var(--btn-gradient);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              display: inline-block;
              position: relative;
            }

            .gradient-heading span::after {
              content: "";
              display: block;
              height: 6px;
              margin: 12px auto 0;
              width: 140px;
              border-radius: 999px;
              background: var(--btn-gradient);
              box-shadow: var(--purple-glow);
            }

            .testimonial-card {
              position: relative;
              border-radius: 22px;
              overflow: hidden;
              backdrop-filter: blur(6px);
              border: 1px solid var(--border);
              box-shadow: var(--shadow-card);
              transform-origin: center;
            }

            .testimonial-card::before {
              content: "";
              position: absolute;
              inset: 1px;
              border-radius: 20px;
              border: 1px solid transparent;
              background: var(--bg-card);
              z-index: 0;
            }

            .testimonial-card .badge-chip {
              display: inline-flex;
              align-items: center;
              padding: 0.25rem 0.6rem;
              border-radius: 999px;
              font-size: 0.75rem;
              font-weight: 600;
              letter-spacing: 0.01em;
              border: 1px solid;
            }

            .energy-line {
              position: absolute;
              left: 0;
              top: 16%;
              bottom: 16%;
              width: 4px;
              background: var(--btn-gradient);
              box-shadow: var(--purple-glow);
              border-radius: 999px;
              overflow: hidden;
            }

            .energy-line::after {
              content: "";
              position: absolute;
              inset: -60% 0;
              background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
              animation: flow 2.5s linear infinite;
            }

            .card-glow {
              position: absolute;
              inset: -15% -25%;
              background: radial-gradient(circle at 10% 10%, var(--glow-hero) 0%, transparent 60%), radial-gradient(circle at 90% 90%, var(--glow-pink) 0%, transparent 60%);
              opacity: 0;
              transition: opacity 0.4s ease;
              pointer-events: none;
              z-index: 0;
            }

            .youtube-orb {
              position: relative;
              width: 48px;
              height: 48px;
              display: grid;
              place-items: center;
              border-radius: 50%;
              background: var(--btn-gradient);
              box-shadow: var(--purple-glow);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .youtube-pulse {
              content: "";
              position: absolute;
              inset: -8px;
              border-radius: 50%;
              border: 2px solid var(--purple-primary);
              animation: pulse 2.6s infinite ease-out;
            }

            .youtube-orb:hover {
              transform: translateY(-2px);
              box-shadow: var(--purple-glow);
            }

            .star-row {
              position: relative;
            }

            .star-icon {
              filter: drop-shadow(0 0 4px rgba(255, 193, 7, 0.4));
              transition: transform 0.3s ease;
            }

            .testimonial-card:hover .star-icon {
              animation: sparkle 1s ease forwards;
            }

            .testimonial-card:hover {
              transform: translateY(-12px) scale(1.02);
              box-shadow: var(--shadow-card);
            }

            .testimonial-card:hover .card-glow {
              opacity: 1;
            }

            .trust-meter {
              display: inline-flex;
              align-items: center;
              gap: 0.4rem;
              font-weight: 500;
            }

            .card-accent-label {
              font-size: 0.75rem;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: var(--text-muted);
            }

            .testimonials-carousel .slick-list {
              padding: 20px 12px 50px;
            }

            .testimonials-carousel .slick-slide {
              transition: transform 0.4s ease, opacity 0.4s ease;
              opacity: 0.75;
              padding-top: 12px;
            }

            .testimonials-carousel .slick-center {
              transform: scale(1.05);
              opacity: 1;
              z-index: 2;
            }

            .testimonials-carousel .slick-dots {
              bottom: -10px;
            }

            .testimonials-carousel .slick-dots li button {
              background: var(--border);
            }
            .testimonials-carousel .slick-dots li.slick-active button {
              background: var(--purple-primary);
            }
            .testimonials-carousel .slick-prev,
            .testimonials-carousel .slick-next {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: var(--bg-card);
              border: 1px solid var(--border);
              font-size: 24px;
              color: var(--text-primary);
              box-shadow: var(--shadow-card);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .testimonials-carousel .slick-prev:hover,
            .testimonials-carousel .slick-next:hover {
              transform: translateY(-2px);
              box-shadow: var(--purple-glow);
            }
            .testimonials-carousel .slick-track {
              display: flex !important;
            }
            .testimonials-carousel .slick-slide {
              height: inherit !important;
              > div {
                height: 100%;
              }
            }

            @keyframes flow {
              from {
                transform: translateY(-100%);
              }
              to {
                transform: translateY(100%);
              }
            }

            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 0.6;
              }
              70% {
                transform: scale(1.2);
                opacity: 0;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }

            @keyframes sparkle {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.25);
              }
              100% {
                transform: scale(1);
              }
            }

            @media (max-width: 768px) {
              .testimonial-card {
                transform: none !important;
              }

              .testimonials-carousel .slick-slide {
                opacity: 1;
              }

              .gradient-heading span::after {
                width: 110px;
              }
            }
          `}</style>
          <Carousel {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="h-full px-2">
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </Carousel>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;