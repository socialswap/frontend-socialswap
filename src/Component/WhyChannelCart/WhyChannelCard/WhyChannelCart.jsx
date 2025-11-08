import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationId;
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let particles = [];

    const createParticles = () => {
      const count = Math.min(80, Math.floor((width * height) / 9000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        alpha: 0.2 + Math.random() * 0.4,
      }));
    };

    const resizeCanvas = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const render = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > height) {
          particle.speedY *= -1;
        }

        context.save();
        context.fillStyle = `rgba(239, 68, 68, ${particle.alpha})`;
        context.shadowColor = 'rgba(220, 38, 38, 0.65)';
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    resizeCanvas();
    render();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-40 pointer-events-none" />;
};

const FeatureCard = ({ icon, title, description, index }) => {
  const isVerifiedCard = title === "Verified Listings";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: -5,
        boxShadow: "0 32px 60px -22px rgba(239, 68, 68, 0.35)",
        borderColor: "rgba(239, 68, 68, 0.45)",
        transition: { type: "spring", stiffness: 320 }
      }}
      className="group relative rounded-3xl bg-white/95 backdrop-blur-lg border border-slate-200 p-8 shadow-[0_14px_50px_-28px_rgba(15,23,42,0.65)] hover:shadow-[0_28px_90px_-30px_rgba(239,68,68,0.45)] transition-all duration-500 cursor-pointer overflow-hidden"
    >
      <div className="glow-trail" />
      <div className="card-play" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <polygon points="45,35 85,60 45,85" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-red-50/40 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <motion.div
          className={`neon-ring w-16 h-16 mx-auto mb-6 relative flex items-center justify-center text-slate-700 group-hover:text-red-500 transition-colors duration-300 ${isVerifiedCard ? "verify-ring" : ""}`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 icon-glow" />
          {isVerifiedCard && (
            <span className="check-pulse" aria-hidden="true">
              ✓
            </span>
          )}
          <div className="relative w-14 h-14 flex items-center justify-center">
            {icon}
          </div>
        </motion.div>

        <h3 className="text-xl font-semibold text-center mb-3 text-slate-900">
          {title}
        </h3>
        <div className="mx-auto mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        <p className="text-slate-600 text-center leading-relaxed text-sm">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
};

const WhySocialSwap = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Verified Listings",
      description: "At SocialSwap, we take the authenticity and reliability of the properties we list for sale seriously. Our team thoroughly examines and verifies all YouTube channels before they are made available on our marketplace."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Safe & Secure Deals",
      description: "For us, the trust of our customers is our utmost priority and we take it very seriously. We use all possible means to make each and every deal smooth and fully secured for both the buyer and seller."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Easy Process",
      description: "At SocialSwap, we make the process of buying and selling as seamless as possible. Our user-friendly platform and dedicated support team are always on hand to assist you every step of the way."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Free Valuation",
      description: "Maximize the value of your channel with the help of our expert team. With years of experience and expertise, our team is dedicated to providing you with the best possible valuation of your channel. We consider all important factors while evaluating your channel."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Proven Track Record",
      description: "Experience the power of a proven platform. With over 2000 content creators having already made successful deals on our marketplace, you can trust that our platform has a solid track record of facilitating safe and secure transactions."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Help Desk",
      description: "Our expert customer support team is dedicated to helping you navigate the buying and selling process. Available to assist you with any queries, our team is committed to providing you with the best possible service by making your journey smoother."
    }
  ];

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ParticleBackground />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-200/40 rounded-full mix-blend-soft-light blur-3xl animate-blob" />
        <div className="absolute -top-12 right-10 w-80 h-80 bg-red-100/50 rounded-full mix-blend-soft-light blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-rose-100/45 rounded-full mix-blend-soft-light blur-[90px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 animate-gradient">
            Why SocialSwap?
          </h2>
          <div className="h-1 w-32 mx-auto pulse-line bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 rounded-full" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-slate-600 max-w-2xl mx-auto"
          >
            The safest way to buy and sell verified YouTube channels — powered by trust and technology.
          </motion.p>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Join thousands of creators who rely on our vetted marketplace for transparent valuations, secure escrow, and white-glove deal support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index} {...feature} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/channels"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 text-white font-semibold rounded-full shadow-[0_18px_45px_-18px_rgba(239,68,68,0.55)] hover:shadow-[0_26px_60px_-18px_rgba(239,68,68,0.65)] hover:scale-105 transition-all duration-300"
          >
            <span>Explore Channels</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.08); }
          66% { transform: translate(-25px, 35px) scale(0.92); }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2.5s;
        }
        .animation-delay-4000 {
          animation-delay: 5s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        .glow-trail {
          position: absolute;
          inset: -55%;
          background: radial-gradient(circle at 20% 20%, rgba(248, 113, 113, 0.25), transparent 60%),
            radial-gradient(circle at 80% 30%, rgba(239, 68, 68, 0.2), transparent 55%),
            radial-gradient(circle at 50% 80%, rgba(190, 18, 60, 0.22), transparent 60%);
          opacity: 0;
          filter: blur(48px);
          transition: opacity 0.5s ease, transform 0.6s ease;
        }
        .group:hover .glow-trail {
          opacity: 0.85;
          transform: scale(1.06);
        }
        .neon-ring::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(248, 113, 113, 0.4), rgba(244, 63, 94, 0.28), rgba(248, 113, 113, 0.35));
          filter: blur(12px);
          opacity: 0.4;
          transition: opacity 0.35s ease;
        }
        .group:hover .neon-ring::before {
          opacity: 0.95;
        }
        .icon-glow {
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(248, 113, 113, 0.35), rgba(248, 113, 113, 0));
          filter: blur(10px);
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .group:hover .icon-glow {
          opacity: 1;
        }
        .card-play {
          position: absolute;
          inset: 18%;
          pointer-events: none;
          color: rgba(248, 113, 113, 0.15);
          transform: rotate(-7deg);
          transition: opacity 0.4s ease, transform 0.6s ease;
        }
        .group:hover .card-play {
          opacity: 0.9;
          transform: rotate(-2deg) scale(1.05);
        }
        .verify-ring {
          box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.08);
        }
        .check-pulse {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          line-height: 1;
          box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4);
          animation: ringPulse 1.6s ease-out infinite;
        }
        @keyframes ringPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(248, 113, 113, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(248, 113, 113, 0);
          }
        }
        .pulse-line {
          position: relative;
          overflow: hidden;
        }
        .pulse-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(248, 113, 113, 0.85), rgba(244, 63, 94, 0.8), transparent);
          animation: pulse 2.5s linear infinite;
          transform: translateX(-100%);
        }
        @keyframes pulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default WhySocialSwap;
