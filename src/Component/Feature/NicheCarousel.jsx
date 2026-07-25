import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Heart,
  ThumbsUp,
  MessageSquare,
  Bell,
  Flame,
  Star,
  Play as PlayIcon,
  Share2,
  Smile,
  Zap,
  Music,
  Camera,
  Gift,
  Award,
  TrendingUp,
  Coffee
} from 'lucide-react';

const niches = [
  { id: 0, title: 'Gaming', icon: '/homelogos/gaming (1).png', color: '#8B5CF6' },
  { id: 1, title: 'Education', icon: '/homelogos/education (1).png', color: '#10B981' },
  { id: 2, title: 'Fashion & Beauty', icon: '/homelogos/fashion & beauty (1).png', color: '#EC4899' },
  { id: 3, title: 'Tech', icon: '/homelogos/tech (1).png', color: '#3B82F6' },
  { id: 4, title: 'Entertainment', icon: '/homelogos/entertainment (1).png', color: '#F59E0B' },
  { id: 5, title: 'Business', icon: '/homelogos/business (1).png', color: '#84CC16' },
  { id: 6, title: 'Finance', icon: '/homelogos/finance (1).png', color: '#06B6D4' },
  { id: 7, title: 'Music', icon: '/homelogos/music (1).png', color: '#6366F1' },
  { id: 8, title: 'Vlogging', icon: '/homelogos/Vlogging (1).png', color: '#F43F5E' },
  { id: 9, title: 'Cooking', icon: '/homelogos/cooking (1).png', color: '#F97316' },
  { id: 10, title: 'News', icon: '/homelogos/news (1).png', color: '#0EA5E9' },
  { id: 11, title: 'Facts', icon: '/homelogos/facts (1).png', color: '#A855F7' },
  { id: 12, title: 'Animation', icon: '/homelogos/animation (1).png', color: '#14B8A6' },
  { id: 13, title: 'Podcast', icon: '/homelogos/podcast (1).png', color: '#EF4444' },
  { id: 14, title: 'Real Estate', icon: '/homelogos/real estate (1).png', color: '#22C55E' },
];

const N = niches.length;

const floatingElements = [
  { icon: Heart, left: '5%', delay: '0s', duration: '3s', color: '#EF4444', size: 24 },
  { icon: ThumbsUp, left: '15%', delay: '-1.5s', duration: '3.5s', color: '#3B82F6', size: 20 },
  { icon: MessageSquare, left: '25%', delay: '-0.8s', duration: '4s', color: '#10B981', size: 22 },
  { icon: Bell, left: '35%', delay: '-2.2s', duration: '3.2s', color: '#F59E0B', size: 20 },
  { icon: Flame, left: '45%', delay: '-0.3s', duration: '3.8s', color: '#EF4444', size: 26 },
  { icon: Star, left: '55%', delay: '-2.7s', duration: '3.6s', color: '#EAB308', size: 24 },
  { icon: PlayIcon, left: '65%', delay: '-1s', duration: '2.8s', color: '#EF4444', size: 18 },
  { icon: Share2, left: '75%', delay: '-2.4s', duration: '3.4s', color: '#8B5CF6', size: 20 },
  { icon: Smile, left: '85%', delay: '-0.5s', duration: '3.1s', color: '#14B8A6', size: 24 },
  { icon: Zap, left: '92%', delay: '-1.9s', duration: '2.9s', color: '#F59E0B', size: 22 },
  { icon: Music, left: '12%', delay: '-2.1s', duration: '3.7s', color: '#EC4899', size: 20 },
  { icon: Camera, left: '28%', delay: '-0.7s', duration: '4.2s', color: '#6366F1', size: 24 },
  { icon: Gift, left: '48%', delay: '-1.3s', duration: '3.3s', color: '#F43F5E', size: 26 },
  { icon: Award, left: '68%', delay: '-0.2s', duration: '3.9s', color: '#EAB308', size: 28 },
  { icon: TrendingUp, left: '82%', delay: '-2.8s', duration: '3.0s', color: '#10B981', size: 22 },
  { icon: Coffee, left: '95%', delay: '-1.1s', duration: '3.5s', color: '#8B5CF6', size: 20 },
];

const NicheCarousel = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const tweenRef = useRef(null);
  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeNiche = niches[activeIndex] || niches[0];

  useGSAP(() => {
    const cards = cardsRef.current;

    // Create the infinite scroll tween (created only once)
    const tween = gsap.to(progressObj.current, {
      value: 1,
      duration: 25,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const pGlobal = progressObj.current.value;
        const isMob = window.innerWidth < 768;
        const w = isMob ? 700 : 1400;
        const h = isMob ? 60 : 150; // Curve height (arch)
        const yOffset = isMob ? 100 : 0;
        let closestIndex = 0;
        let minD = 999;

        niches.forEach((niche, i) => {
          if (!cards[i]) return;

          // Normalized progress for each card [0, 1]
          const p = (i / N + pGlobal) % 1;
          
          // Map to parameter t [-1.4, 1.4] to allow entry/exit off-screen and add gaps
          const t = -1.4 + 2.8 * p;

          const x = (w / 2) * t;
          // Inverted parabola: y is 0 at edges and -height at center (t = 0). Shift up on mobile to avoid overlapping play button.
          const y = -h * (1 - t * t) - yOffset;

          // Calculate slope to tilt the card along the curve
          const slope = (4 * h * t) / w;
          const angleDeg = Math.atan(slope) * (180 / Math.PI);

          // Scale: slightly larger in the center, smaller at the edges
          const scale = 1 - Math.abs(t) * 0.15;

          // Opacity: fade out smoothly as it approaches the boundary edges
          let opacity = 1;
          if (Math.abs(t) > 1.1) {
            opacity = Math.max(0, 1 - (Math.abs(t) - 1.1) / 0.3);
          }

          // Track the card closest to the center (t = 0)
          if (Math.abs(t) < minD) {
            minD = Math.abs(t);
            closestIndex = i;
          }

          gsap.set(cards[i], {
            x: x,
            y: y,
            rotation: angleDeg,
            scale: scale,
            opacity: opacity,
            zIndex: 10,
          });
        });

        // Update active index in React state only when it changes
        setActiveIndex(prev => {
          if (prev !== closestIndex) return closestIndex;
          return prev;
        });
      }
    });

    tweenRef.current = tween;

    // Apply initial hover state
    if (isHovered) {
      tween.pause();
    }

    return () => {
      tween.kill();
    };
  }, { dependencies: [], scope: containerRef });



  // Separate effect to handle play/pause on hover to prevent recreation
  useEffect(() => {
    if (tweenRef.current) {
      if (isHovered) {
        tweenRef.current.pause();
      } else {
        tweenRef.current.play();
      }
    }
  }, [isHovered]);

  return (
    <div 
      className="relative w-full h-[550px] md:h-[700px] flex items-center justify-center overflow-hidden bg-transparent pt-12"
      ref={containerRef}
    >
      {/* Background Image (desktop only) */}
      <div 
        className="absolute inset-0 hidden md:block pointer-events-none"
        style={{
          backgroundImage: `url('/homelogos/backgroundLogo (1).png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
        }}
      />
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Reaction Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <style>{`
          @keyframes floatReaction {
            0% {
              transform: translateY(800px) translateX(0px) scale(0.5);
              opacity: 0;
            }
            15% {
              opacity: 0.5;
            }
            50% {
              transform: translateY(0px) translateX(var(--sway-x, 40px)) scale(1.2);
              opacity: 0.5;
            }
            85% {
              opacity: 0.5;
            }
            100% {
              transform: translateY(-800px) translateX(0px) scale(0.8);
              opacity: 0;
            }
          }
          .floating-reaction {
            animation: floatReaction var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
            animation-fill-mode: both; /* Keeps elements hidden during the delay phase */
            left: var(--left);
            --sway-x: 35px;
          }
          .floating-reaction:nth-child(even) {
            --sway-x: -35px;
          }
        `}</style>
        {floatingElements.map((el, index) => {
          const Icon = el.icon;
          const iconSize = isMobile ? el.size * 1.3 : el.size * 2.2; // 1.3x on mobile, 2.2x on desktop
          return (
            <div
              key={index}
              className="absolute bottom-0 floating-reaction opacity-0 select-none filter drop-shadow-sm pointer-events-none"
              style={{
                '--duration': el.duration,
                '--delay': el.delay,
                '--left': el.left,
              }}
            >
              <Icon 
                size={iconSize} 
                color={el.color} 
                fill={el.color === '#EF4444' || el.color === '#EAB308' ? el.color : 'transparent'} 
                className="opacity-40"
              />
            </div>
          );
        })}
      </div>

      {/* Orbiting Cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full pointer-events-none">
        {niches.map((niche, i) => {
          return (
            <div
              key={niche.id}
              ref={el => cardsRef.current[i] = el}
              className="absolute top-1/2 left-1/2 w-24 h-24 md:w-44 md:h-44 rounded-[28px] backdrop-blur-[24px] bg-white/20 dark:bg-white/10 border border-white/40 dark:border-white/20 shadow-2xl flex flex-col items-center justify-center gap-1 md:gap-3 pointer-events-auto cursor-pointer hover:bg-white/30 dark:hover:bg-white/20 hover:scale-105 transition-all duration-300 group"
              style={{
                boxShadow: `0 15px 35px -10px ${niche.color}50`,
                marginTop: isMobile ? '-48px' : '-88px',
                marginLeft: isMobile ? '-48px' : '-88px',
              }}
              onMouseEnter={() => !isMobile && setIsHovered(true)}
              onMouseLeave={() => !isMobile && setIsHovered(false)}
              onClick={() => {
                navigate(`/channels?category=${encodeURIComponent(niche.title)}`);
              }}
            >
              <img 
                src={niche.icon} 
                alt={niche.title} 
                style={{ 
                  width: isMobile ? 48 : 80, 
                  height: isMobile ? 48 : 80, 
                  objectFit: 'contain',
                  filter: `drop-shadow(0px 8px 16px ${niche.color}80)`
                }} 
              />
              <span className="text-[10px] md:text-sm font-extrabold mt-1 md:mt-2 text-center px-2 text-white drop-shadow-md tracking-wide">
                {niche.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Center Diamond Play Button */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center">
        {/* Dust Impact Elements (hidden) */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none z-0 hidden">
          <div className="dust-ring-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-[4px] border-gray-400/50 dark:border-gray-200/40" />
          <div className="dust-ring-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[8px] border-gray-400/30 dark:border-gray-200/20" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`dust-particle-${i} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-gray-400/80 dark:bg-gray-200/80 rounded-full blur-[1px]`} />
          ))}
        </div>

        {/* Diamond Play Button Image */}
        <style>{`
          @keyframes floatUpDown {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-14px); }
          }
          .play-plaque-float {
            animation: floatUpDown 2.8s ease-in-out infinite;
          }
        `}</style>
        <div 
          className="play-plaque play-plaque-float relative w-[340px] md:w-[630px] flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={() => navigate('/channels')}
        >
          <img 
            src="/homelogos/DiamandPlayButton.png" 
            alt="Diamond Play Button"
            className="w-full h-auto drop-shadow-2xl"
            style={{ 
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
            }}
          />
        </div>
      </div>

      {/* Dynamic Text below Play Button */}
      <div className="absolute top-[60%] md:top-[65%] left-1/2 -translate-x-1/2 z-40 text-center w-full px-4 pointer-events-none mt-10">
        <h2 
          key={activeNiche.title}
          className="niche-title text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent mb-2"
          style={{ backgroundImage: 'var(--btn-gradient)' }}
        >
          {activeNiche.title}
        </h2>
        <p className="text-text-secondary text-sm md:text-base font-medium max-w-sm mx-auto">
          Explore top monetized {activeNiche.title.toLowerCase()} channels.
        </p>
      </div>
    </div>
  );
};

export default NicheCarousel;
