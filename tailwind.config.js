/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors referencing CSS variables
        'bg-primary':       'var(--bg-primary)',
        'bg-secondary':     'var(--bg-secondary)',
        'bg-hero':          'var(--bg-hero)',
        'bg-card':          'var(--bg-card)',
        'bg-glass':         'var(--bg-glass)',
        
        // Brand colors
        'primary':          'var(--primary)',
        'primary-hover':    'var(--primary-hover)',
        'primary-active':   'var(--primary-active)',
        'purple-primary':   'var(--purple-primary)',
        'purple-hover':     'var(--purple-hover)',
        'purple-secondary': 'var(--purple-secondary)',
        'accent-purple':    'var(--accent-purple)',
        'accent-pink':      'var(--accent-pink)',
        'accent-cyan':      'var(--accent-cyan)',
        'accent-blue':      'var(--accent-blue)',

        // Semantic colors
        success:            'var(--success)',
        warning:            'var(--warning)',
        error:              'var(--error)',

        // Text colors
        'text-primary':     'var(--text-primary)',
        'text-secondary':   'var(--text-secondary)',
        'text-muted':       'var(--text-muted)',
        'text-disabled':    'var(--text-disabled)',

        // Border colors
        'border-color':     'var(--border)',
      },
      backgroundImage: {
        'btn-gradient':   'var(--btn-gradient)',
        'hero-gradient':  'var(--hero-gradient)',
        'card-gradient':  'var(--card-gradient)',
      },
      boxShadow: {
        'purple-glow':  'var(--shadow-purple)',
        'pink-glow':    'var(--shadow-pink)',
        'blue-glow':    '0 0 30px var(--glow-blue)',
        'card-shadow':  'var(--shadow-card)',
        'border-glow':  'var(--border-glow)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow':           'glow 2s ease-in-out infinite alternate',
        'shimmer':        'shimmer 2.5s linear infinite',
        'star-twinkle':   'twinkle 3s ease-in-out infinite',
        'slide-up':       'slideUp 0.6s ease-out forwards',
        'fade-in':        'fadeIn 0.5s ease-out forwards',
        'hero-bounce':    'hero-bounce 2s ease-in-out infinite',
        'scroller-arrow-bounce': 'scroller-arrow-bounce 1.5s infinite ease-in-out',
        'fade-in-rise':   'fadeInRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-ring':     'pulseRing 3.6s ease-in-out infinite',
        'meter-sweep':    'meterSweep 2.8s ease-in-out infinite',
        'sparkle-burst':  'sparkleBurst 1.4s ease-out forwards',
        'orbit-float':    'orbit-float 20s ease-in-out infinite',
        'orbit-float-reverse': 'orbit-float 25s ease-in-out infinite reverse',
        'orb-float-1':    'orb-float 15s ease-in-out infinite',
        'orb-float-2':    'orb-float 18s ease-in-out infinite reverse',
        'orb-float-3':    'orb-float 12s ease-in-out infinite',
        'card-border-glow': 'card-border-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'text-glow':      'text-glow 2s ease-in-out infinite alternate',
        'pulsate-glow':   'pulsate-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(124,58,237,0.4)' },
          to:   { boxShadow: '0 0 40px rgba(168,85,247,0.7), 0 0 80px rgba(124,58,237,0.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.7)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'hero-bounce': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%':      { transform: 'translateX(-50%) translateY(8px)' },
        },
        'scroller-arrow-bounce': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%':      { transform: 'translateX(6px)' },
        },
        'fadeInRise': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulseRing': {
          '0%': { transform: 'scale(1)', opacity: '0.65' },
          '70%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        'meterSweep': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'sparkleBurst': {
          '0%': { transform: 'scale(0.65)', opacity: '0' },
          '40%': { opacity: '0.7' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        'orbit-float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%':      { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%':      { transform: 'translate(-30px, 30px) rotate(240deg)' },
        },
        'orb-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%':      { transform: 'translate(50px, -50px) scale(1.1)' },
        },
        'card-border-glow': {
          '0%, 100%': {
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.4), 0 0 80px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 40px rgba(255, 255, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.5), 0 0 100px rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 50px rgba(255, 255, 255, 0.4)'
          }
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'text-glow': {
          'from': { filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))' },
          'to':   { filter: 'drop-shadow(0 4px 15px rgba(0, 0, 0, 0.15))' },
        },
        'pulsate-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 0, 0, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.15)'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
