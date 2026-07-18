import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Gamepad2, 
  GraduationCap, 
  Shirt, 
  Monitor, 
  Baby, 
  Tractor, 
  Atom, 
  BookOpen, 
  Clapperboard,
  Heart,
  ThumbsUp,
  MessageSquare,
  Bell,
  Flame,
  Star,
  Play as PlayIcon,
  Share2,
  ChevronLeft,
  ChevronRight,
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
  { id: 0, title: 'Gaming', icon: Gamepad2, color: '#8B5CF6' },
  { id: 1, title: 'Education', icon: GraduationCap, color: '#10B981' },
  { id: 2, title: 'Fashion', icon: Shirt, color: '#EC4899' },
  { id: 3, title: 'Tech', icon: Monitor, color: '#3B82F6' },
  { id: 4, title: 'Kids Content', icon: Baby, color: '#F59E0B' },
  { id: 5, title: 'Agriculture', icon: Tractor, color: '#84CC16' },
  { id: 6, title: 'Science', icon: Atom, color: '#06B6D4' },
  { id: 7, title: 'Storytelling', icon: BookOpen, color: '#6366F1' },
  { id: 8, title: 'Movies & Web', icon: Clapperboard, color: '#F43F5E' },
];

const N = niches.length;

const floatingElements = [
  { icon: Heart, left: '5%', delay: '0s', duration: '3s', color: '#EF4444', size: 24 },
  { icon: ThumbsUp, left: '15%', delay: '1.5s', duration: '3.5s', color: '#3B82F6', size: 20 },
  { icon: MessageSquare, left: '25%', delay: '0.8s', duration: '4s', color: '#10B981', size: 22 },
  { icon: Bell, left: '35%', delay: '2.2s', duration: '3.2s', color: '#F59E0B', size: 20 },
  { icon: Flame, left: '45%', delay: '0.3s', duration: '3.8s', color: '#EF4444', size: 26 },
  { icon: Star, left: '55%', delay: '2.7s', duration: '3.6s', color: '#EAB308', size: 24 },
  { icon: PlayIcon, left: '65%', delay: '1s', duration: '2.8s', color: '#EF4444', size: 18 },
  { icon: Share2, left: '75%', delay: '2.4s', duration: '3.4s', color: '#8B5CF6', size: 20 },
  { icon: Smile, left: '85%', delay: '0.5s', duration: '3.1s', color: '#14B8A6', size: 24 },
  { icon: Zap, left: '92%', delay: '1.9s', duration: '2.9s', color: '#F59E0B', size: 22 },
  { icon: Music, left: '12%', delay: '2.1s', duration: '3.7s', color: '#EC4899', size: 20 },
  { icon: Camera, left: '28%', delay: '0.7s', duration: '4.2s', color: '#6366F1', size: 24 },
  { icon: Gift, left: '48%', delay: '1.3s', duration: '3.3s', color: '#F43F5E', size: 26 },
  { icon: Award, left: '68%', delay: '0.2s', duration: '3.9s', color: '#EAB308', size: 28 },
  { icon: TrendingUp, left: '82%', delay: '2.8s', duration: '3.0s', color: '#10B981', size: 22 },
  { icon: Coffee, left: '95%', delay: '1.1s', duration: '3.5s', color: '#8B5CF6', size: 20 },
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

  // Theme tracking for play button plaque
  const [isLightMode, setIsLightMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'light';
    return document.documentElement.classList.contains('light') ||
           document.documentElement.getAttribute('data-theme') === 'light';
  });

  useEffect(() => {
    // Sync theme state on initial mount
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsLightMode(saved === 'light');
    } else {
      setIsLightMode(
        document.documentElement.classList.contains('light') ||
        document.documentElement.getAttribute('data-theme') === 'light'
      );
    }

    const observe = () => {
      const root = document.documentElement;
      setIsLightMode(
        root.classList.contains('light') ||
        root.getAttribute('data-theme') === 'light'
      );
    };

    const observer = new MutationObserver(observe);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeNiche = niches[activeIndex] || niches[0];

  // Dynamic theme colors for the play button facets
  const colors = isLightMode 
    ? {
        base: "#CBD5E1",
        f1: "#E2E8F0",
        f2: "#F1F5F9",
        f3: "#94A3B8",
        f4: "#CBD5E1",
        f5: "#F8FAFC",
        f6: "#FFFFFF"
      }
    : {
        base: "#0F172A",
        f1: "#1E293B",
        f2: "#334155",
        f3: "#0F172A",
        f4: "#475569",
        f5: "#1E293B",
        f6: "#64748B"
      };

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

  // Cinematic entrance animation on mount
  useGSAP(() => {
    gsap.fromTo('.play-plaque', 
      {
        y: isMobile ? -1000 : -2000,
        x: isMobile ? -1000 : -2000,
        scale: isMobile ? 4.0 : 8.0,
        rotation: 2160, // 6 full spins like a fan
        rotationY: 1080, // 3 coin spins
        autoAlpha: 0, // opacity 0 and visibility hidden
      },
      {
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        rotationY: 0,
        autoAlpha: 1,
        duration: 1.0,
        delay: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          // Screen Shake on impact
          gsap.fromTo(containerRef.current, 
            { y: 15 }, 
            { y: 0, duration: 0.5, ease: "elastic.out(1, 0.2)" }
          );
          
          // Dust Rings Expanding
          gsap.fromTo('.dust-ring-1', 
            { scale: 0.8, opacity: 0.8, autoAlpha: 1 }, 
            { scale: 2.5, opacity: 0, duration: 0.6, ease: "power2.out" }
          );
          gsap.fromTo('.dust-ring-2', 
            { scale: 0.8, opacity: 0.6, autoAlpha: 1 }, 
            { scale: 3.5, opacity: 0, duration: 0.8, ease: "power2.out" }
          );
          
          // Dust Particles Exploding Outward
          for(let i = 0; i < 8; i++) {
            const angle = (i * 45) * (Math.PI / 180);
            const dist = 120 + Math.random() * 80;
            gsap.fromTo(`.dust-particle-${i}`,
              { x: "-50%", y: "-50%", opacity: 0.8, scale: Math.random() * 0.5 + 0.8, autoAlpha: 1 },
              { 
                x: `calc(-50% + ${Math.cos(angle) * dist}px)`, 
                y: `calc(-50% + ${Math.sin(angle) * dist}px)`, 
                opacity: 0, 
                scale: 0,
                duration: 0.5 + Math.random() * 0.4,
                ease: "power2.out"
              }
            );
          }
        }
      }
    );
  }, { dependencies: [], scope: containerRef });

  // Handle play button and crystal shimmer theme animations separately to prevent memory leaks
  useGSAP(() => {
    // Pulse animation for the red play icon
    const pulse = gsap.to('.play-icon', {
      scale: 1.15,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '121px 80px'
    });

    // Shimmer/Glitter animation for the diamond cuts (sparkle every 300ms)
    const shimmer = gsap.to('.shimmer-highlight', {
      opacity: isLightMode ? 0.45 : 0.3,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        amount: 0.2,
        from: "random"
      }
    });

    return () => {
      pulse.kill();
      shimmer.kill();
    };
  }, { dependencies: [isLightMode], scope: containerRef });

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
          const Icon = niche.icon;
          return (
            <div
              key={niche.id}
              ref={el => cardsRef.current[i] = el}
              className="absolute top-1/2 left-1/2 w-24 h-24 md:w-44 md:h-44 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center gap-1 md:gap-3 pointer-events-auto cursor-pointer transition-colors hover:border-white/40"
              style={{
                backgroundColor: 'var(--bg-glass)',
                boxShadow: `0 10px 30px -10px ${niche.color}40`,
                marginTop: isMobile ? '-48px' : '-88px',
                marginLeft: isMobile ? '-48px' : '-88px',
              }}
              onMouseEnter={() => !isMobile && setIsHovered(true)}
              onMouseLeave={() => !isMobile && setIsHovered(false)}
              onClick={() => {
                // Instantly advance progress to make this card active
                const currentP = progressObj.current.value;
                const targetP = (N - i) / N;
                // Animate smoothly to target position
                gsap.to(progressObj.current, {
                  value: targetP,
                  duration: 0.5,
                  ease: 'power2.out',
                  onUpdate: () => tweenRef.current && tweenRef.current.vars.onUpdate()
                });
              }}
            >
              <Icon size={isMobile ? 28 : 44} color={niche.color} />
              <span className="text-[10px] md:text-sm font-bold mt-1 md:mt-2 text-center px-2" style={{ color: 'var(--text-primary)' }}>
                {niche.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Center Rectangular Play Button and Dust Impact */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center mt-[-20px] md:mt-[-40px]">
        {/* Dust Impact Elements (fired onComplete of landing animation) */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none z-0">
          <div className="dust-ring-1 invisible opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-[4px] border-gray-400/50 dark:border-gray-200/40" />
          <div className="dust-ring-2 invisible opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[8px] border-gray-400/30 dark:border-gray-200/20" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`dust-particle-${i} invisible opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-gray-400/80 dark:bg-gray-200/80 rounded-full blur-[1px]`} />
          ))}
        </div>

        {/* Rectangular Plaque */}
        <div 
          className="play-plaque invisible opacity-0 relative w-52 h-36 md:w-72 md:h-48 flex items-center justify-center group pointer-events-auto cursor-pointer transition-transform hover:scale-105 duration-500"
          onClick={() => navigate('/channels')}
        >
          <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-2xl">
            <defs>
              <clipPath id="rounded-rect">
                <rect x="0" y="0" width="240" height="160" rx="24" />
              </clipPath>
            </defs>
            <g clipPath="url(#rounded-rect)">
              {/* Base background */}
              <rect width="240" height="160" fill={colors.base} />
              {/* Facets */}
              <polygon points="0,0 120,0 80,60" fill={colors.f1} />
              <polygon points="120,0 240,0 150,50" fill={colors.f2} />
              <polygon points="240,0 240,90 150,50" fill={colors.f3} />
              <polygon points="240,90 240,160 170,110" fill={colors.f4} />
              <polygon points="240,160 120,160 170,110" fill={colors.f5} />
              <polygon points="120,160 0,160 80,110" fill={colors.f3} />
              <polygon points="0,160 0,70 80,110" fill={colors.f1} />
              <polygon points="0,70 0,0 80,60" fill={colors.f2} />
              {/* Center crystal structures */}
              <polygon points="80,60 120,0 150,50" fill={colors.f4} />
              <polygon points="150,50 240,90 170,110" fill={colors.f5} />
              <polygon points="170,110 120,160 80,110" fill={colors.f3} />
              <polygon points="80,110 0,70 80,60" fill={colors.f1} />
              {/* Inner core facets around the play triangle */}
              <polygon points="80,60 150,50 120,80" fill={colors.f6} opacity={isLightMode ? 0.8 : 0.15} />
              <polygon points="150,50 170,110 120,80" fill={colors.f4} />
              <polygon points="170,110 80,110 120,80" fill={colors.f3} />
              <polygon points="80,110 80,60 120,80" fill={colors.f2} />
              
              {/* Shimmer Highlight Overlays */}
              <polygon points="120,0 240,0 150,50" fill="#FFFFFF" opacity="0" className="shimmer-highlight" />
              <polygon points="80,60 120,0 150,50" fill="#FFFFFF" opacity="0" className="shimmer-highlight" />
              <polygon points="150,50 240,90 170,110" fill="#FFFFFF" opacity="0" className="shimmer-highlight" />
              <polygon points="240,160 120,160 170,110" fill="#FFFFFF" opacity="0" className="shimmer-highlight" />
              <polygon points="80,60 150,50 120,80" fill="#FFFFFF" opacity="0" className="shimmer-highlight" />
              
              {/* Play Triangle (Red & Pulsing) */}
              <polygon 
                points="106,62 106,98 136,80" 
                fill="#EF4444" 
                className="play-icon transition-transform duration-300"
              />
            </g>
            {/* Glossy border */}
            <rect x="1" y="1" width="238" height="158" rx="23" fill="none" stroke={isLightMode ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"} strokeWidth="2" />
          </svg>
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
