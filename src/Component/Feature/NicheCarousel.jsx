import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Heart, ThumbsUp, MessageSquare, Bell, Flame, Star,
  Play as PlayIcon, Share2, Smile, Zap, Music, Camera,
  Gift, Award, TrendingUp, Coffee
} from 'lucide-react';

const niches = [
  { id: 0,  title: 'Gaming',          icon: '/homelogos/gaming (1).webp',          color: '#8B5CF6' },
  { id: 1,  title: 'Education',       icon: '/homelogos/education (1).webp',        color: '#10B981' },
  { id: 2,  title: 'Fashion & Beauty',icon: '/homelogos/fashion & beauty (1).webp', color: '#EC4899' },
  { id: 3,  title: 'Tech',            icon: '/homelogos/tech (1).webp',             color: '#3B82F6' },
  { id: 4,  title: 'Entertainment',   icon: '/homelogos/entertainment (1).webp',    color: '#F59E0B' },
  { id: 5,  title: 'Business',        icon: '/homelogos/business (1).webp',         color: '#84CC16' },
  { id: 6,  title: 'Finance',         icon: '/homelogos/finance (1).webp',          color: '#06B6D4' },
  { id: 7,  title: 'Music',           icon: '/homelogos/music (1).webp',            color: '#6366F1' },
  { id: 8,  title: 'Vlogging',        icon: '/homelogos/Vlogging (1).webp',         color: '#F43F5E' },
  { id: 9,  title: 'Cooking',         icon: '/homelogos/cooking (1).webp',          color: '#F97316' },
  { id: 10, title: 'News',            icon: '/homelogos/news (1).webp',             color: '#0EA5E9' },
  { id: 11, title: 'Facts',           icon: '/homelogos/facts (1).webp',            color: '#A855F7' },
  { id: 12, title: 'Animation',       icon: '/homelogos/animation (1).webp',        color: '#14B8A6' },
  { id: 13, title: 'Podcast',         icon: '/homelogos/podcast (1).webp',          color: '#EF4444' },
  { id: 14, title: 'Real Estate',     icon: '/homelogos/real estate (1).webp',      color: '#22C55E' },
];

const N = niches.length;

const floatingElements = [
  { icon: Heart,      left: '5%',  delay: '0s',    duration: '3s',   color: '#EF4444', size: 24 },
  { icon: ThumbsUp,   left: '15%', delay: '-1.5s', duration: '3.5s', color: '#3B82F6', size: 20 },
  { icon: MessageSquare, left: '25%', delay: '-0.8s', duration: '4s', color: '#10B981', size: 22 },
  { icon: Bell,       left: '35%', delay: '-2.2s', duration: '3.2s', color: '#F59E0B', size: 20 },
  { icon: Flame,      left: '45%', delay: '-0.3s', duration: '3.8s', color: '#EF4444', size: 26 },
  { icon: Star,       left: '55%', delay: '-2.7s', duration: '3.6s', color: '#EAB308', size: 24 },
  { icon: PlayIcon,   left: '65%', delay: '-1s',   duration: '2.8s', color: '#EF4444', size: 18 },
  { icon: Share2,     left: '75%', delay: '-2.4s', duration: '3.4s', color: '#8B5CF6', size: 20 },
  { icon: Smile,      left: '85%', delay: '-0.5s', duration: '3.1s', color: '#14B8A6', size: 24 },
  { icon: Zap,        left: '92%', delay: '-1.9s', duration: '2.9s', color: '#F59E0B', size: 22 },
  { icon: Music,      left: '12%', delay: '-2.1s', duration: '3.7s', color: '#EC4899', size: 20 },
  { icon: Camera,     left: '28%', delay: '-0.7s', duration: '4.2s', color: '#6366F1', size: 24 },
  { icon: Gift,       left: '48%', delay: '-1.3s', duration: '3.3s', color: '#F43F5E', size: 26 },
  { icon: Award,      left: '68%', delay: '-0.2s', duration: '3.9s', color: '#EAB308', size: 28 },
  { icon: TrendingUp, left: '82%', delay: '-2.8s', duration: '3.0s', color: '#10B981', size: 22 },
  { icon: Coffee,     left: '95%', delay: '-1.1s', duration: '3.5s', color: '#8B5CF6', size: 20 },
];

const NicheCarousel = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => !document.documentElement.classList.contains('dark'));

  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const tweenRef = useRef(null);
  const progressObj = useRef({ value: 0 });

  // drag state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startProgress: 0,
    moved: false, // track if actually dragged vs clicked
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observe = () => setIsLightMode(!document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(observe);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  const activeNiche = niches[activeIndex] || niches[0];

  // ─── GSAP horizontal ticker ─────────────────────────────────────────────────
  useGSAP(() => {
    const cards = cardsRef.current;

    const tween = gsap.to(progressObj.current, {
      value: 1,
      duration: 28, // ← speed: higher = slower (was 14)
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const pGlobal = progressObj.current.value;
        const isMob = window.innerWidth < 768;
        const contW   = containerRef.current?.offsetWidth || 1200;
        const cardW   = isMob ? 96  : 176;  // w-24 / w-44
        const step    = isMob ? (contW / 3.2) : (contW / 6); // exactly 6 on desktop
        const totalW  = N * step;
        const halfC   = contW / 2;
        const fadeZone = cardW * 0.6; // fade in/out zone at edges

        let closestDist = 999;
        let closestIdx  = 0;

        niches.forEach((_, i) => {
          if (!cards[i]) return;

          // p ∈ [0,1), mapped so card starts far left and exits far right
          const p = ((i / N) + pGlobal) % 1;
          // x: from (-halfC - cardW) → (-halfC - cardW + totalW)
          const x = -halfC - cardW + p * totalW;

          // ── Only visible when inside the viewport ──────────────────────────
          // Fade in at left edge, fade out at right edge, invisible outside
          let opacity = 0;
          if (x >= -halfC - cardW && x <= halfC + cardW) {
            // inside the drawable region
            if (x < -halfC + fadeZone) {
              // fading in from left
              opacity = Math.max(0, (x + halfC) / fadeZone);
            } else if (x > halfC - fadeZone) {
              // fading out to right
              opacity = Math.max(0, 1 - (x - halfC + fadeZone) / fadeZone);
            } else {
              opacity = 1;
            }
          }
          // Cards completely outside viewport → opacity 0 (invisible return journey)

          // Active card = closest to center (x ≈ 0)
          const dist = Math.abs(x);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx  = i;
          }

          // ── Arch curve: center stays, edges curve DOWN ─────────────────────
          // normalizedX: 0 at center, ±1 at container edges
          const normalizedX = x / halfC;
          const curveDepth  = isMob ? 40 : 90; // how far edges dip down (px)
          const curveY      = curveDepth * (normalizedX * normalizedX);

          // Slight tilt along the curve slope: dy/dx = 2 * curveDepth * normalizedX / halfC
          const slope    = (2 * curveDepth * normalizedX) / halfC;
          const rotation = Math.atan(slope) * (180 / Math.PI) * 0.6; // soften tilt

          // Scale: center slightly bigger, edges slightly smaller
          const scale = 1 - Math.abs(normalizedX) * 0.12;

          gsap.set(cards[i], {
            x,
            y: curveY,
            rotation,
            scale,
            opacity,
            zIndex: 10,
            force3D: true,
          });
        });

        setActiveIndex(prev => (prev !== closestIdx ? closestIdx : prev));
      },
    });

    tweenRef.current = tween;
    return () => tween.kill();
  }, { dependencies: [], scope: containerRef });

  // Pause on hover
  useEffect(() => {
    if (!tweenRef.current) return;
    if (isHovered) tweenRef.current.pause();
    else tweenRef.current.play();
  }, [isHovered]);

  // ─── Drag handlers ────────────────────────────────────────────────────────
  const handleDragStart = (clientX) => {
    dragRef.current.isDragging = true;
    dragRef.current.moved      = false;
    dragRef.current.startX     = clientX;
    dragRef.current.startProgress = progressObj.current.value;
    if (tweenRef.current) tweenRef.current.pause();
  };

  const handleDragMove = (clientX) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = clientX - dragRef.current.startX;
    if (Math.abs(deltaX) > 4) dragRef.current.moved = true; // threshold to distinguish click
    const isMob = window.innerWidth < 768;
    const contW = containerRef.current?.offsetWidth || window.innerWidth;
    const step  = isMob ? (contW / 3.2) : (contW / 6);
    const totalW = N * step;
    const progressDelta = deltaX / totalW;
    let newProgress = (dragRef.current.startProgress + progressDelta) % 1;
    if (newProgress < 0) newProgress += 1;
    progressObj.current.value = newProgress;
    if (tweenRef.current) tweenRef.current.vars.onUpdate();
  };

  const handleDragEnd = () => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    // Resume only if not hovering
    if (!isHovered && tweenRef.current) tweenRef.current.play();
  };

  // Global listeners so drag works even when mouse leaves container
  useEffect(() => {
    const onMove = (e) => handleDragMove(e.clientX);
    const onUp   = ()  => handleDragEnd();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered]);

  return (
    <div
      className="relative w-full h-[420px] md:h-[620px] flex items-center justify-center overflow-hidden bg-transparent select-none"
      ref={containerRef}
      onMouseDown={(e)  => handleDragStart(e.clientX)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e)  => { e.preventDefault(); handleDragMove(e.touches[0].clientX); }}
      onTouchEnd={handleDragEnd}
      style={{ cursor: dragRef.current.isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Background image — full opacity in light, subtle in dark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('${isMobile ? '/homelogos/mobileBG (1).webp' : '/homelogos/backgroundLogo (1).webp'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isLightMode ? 1.0 : 0.65,
        }}
      />

      {/* Floating Reaction Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <style>{`
          @keyframes floatReaction {
            0%   { transform: translateY(600px) scale(0.5); opacity: 0; }
            15%  { opacity: 0.45; }
            50%  { transform: translateY(0px) translateX(var(--sway-x,40px)) scale(1.2); opacity: 0.45; }
            85%  { opacity: 0.45; }
            100% { transform: translateY(-600px) scale(0.8); opacity: 0; }
          }
          .floating-reaction {
            animation: floatReaction var(--duration) ease-in-out infinite;
            animation-delay: var(--delay);
            animation-fill-mode: both;
            left: var(--left);
            will-change: transform, opacity;
            --sway-x: 35px;
          }
          .floating-reaction:nth-child(even) { --sway-x: -35px; }
        `}</style>
        {floatingElements.map((el, idx) => {
          const Icon = el.icon;
          const sz   = isMobile ? el.size * 1.3 : el.size * 2;
          return (
            <div
              key={idx}
              className="absolute bottom-0 floating-reaction opacity-0 select-none pointer-events-none"
              style={{ '--duration': el.duration, '--delay': el.delay, '--left': el.left }}
            >
              <Icon size={sz} color={el.color}
                fill={['#EF4444','#EAB308'].includes(el.color) ? el.color : 'transparent'}
                className="opacity-40"
              />
            </div>
          );
        })}
      </div>

      {/* ── Ticker Cards ────────────────────────────────────────────── */}
      {/* Cards are positioned relative to the CENTER of this container via GSAP x */}
      <div className="absolute top-[33%] md:top-[40%] left-1/2 z-10 pointer-events-none">
        {niches.map((niche, i) => (
          <div
            key={niche.id}
            ref={el => cardsRef.current[i] = el}
            className="absolute w-24 h-24 md:w-44 md:h-44 rounded-[28px] will-change-transform
                       bg-white/20 dark:bg-white/10 border border-white/40 dark:border-white/20
                       shadow-2xl flex flex-col items-center justify-center gap-1 md:gap-2
                       pointer-events-auto"
            style={{
              boxShadow: `0 12px 30px -8px ${niche.color}55`,
              marginTop:  isMobile ? '-48px' : '-88px',
              marginLeft: isMobile ? '-48px' : '-88px',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              if (!dragRef.current.moved) {
                navigate(`/channels?category=${encodeURIComponent(niche.title)}`);
              }
            }}
          >
            <img
              src={niche.icon}
              alt={niche.title}
              draggable={false}
              style={{
                width:  isMobile ? 44 : 80,
                height: isMobile ? 44 : 80,
                objectFit: 'contain',
                filter: `drop-shadow(0px 6px 14px ${niche.color}80)`,
                pointerEvents: 'none',
              }}
            />
            <span className="text-[9px] md:text-xs font-extrabold text-center px-2 text-white drop-shadow-md tracking-wide leading-tight">
              {niche.title}
            </span>
          </div>
        ))}
      </div>

      {/* ── Diamond Play Button ──────────────────────────────────────── */}
      <div className="absolute top-[65%] md:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center">
        <style>{`
          @keyframes floatUpDown {
            0%   { transform: translateY(0px) scaleY(1); }
            20%  { transform: translateY(-30px) scaleY(1.05); }
            40%  { transform: translateY(-32px) scaleY(1.06); }
            60%  { transform: translateY(6px) scaleY(0.95); }
            75%  { transform: translateY(-10px) scaleY(1.02); }
            88%  { transform: translateY(2px) scaleY(0.99); }
            100% { transform: translateY(0px) scaleY(1); }
          }
          .play-plaque-float {
            animation: floatUpDown 2.2s ease-in-out infinite;
            transform-origin: center bottom;
          }
        `}</style>
        <div
          className="play-plaque-float relative w-[260px] md:w-[520px] flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={() => navigate('/channels')}
        >
          <img
            src="/homelogos/DiamandPlayButton.webp"
            alt="Diamond Play Button"
            className="w-full h-auto drop-shadow-2xl"
            draggable={false}
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))' }}
          />
        </div>
      </div>

      {/* ── Active category label ────────────────────────────────────── */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 text-center w-full px-4 pointer-events-none">
        <h2
          key={activeNiche.title}
          className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent mb-1"
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
