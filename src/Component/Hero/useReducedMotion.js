import { useState, useEffect } from 'react';

/**
 * Custom hook that detects if the user prefers reduced motion.
 * Returns true if the OS-level "prefers-reduced-motion: reduce" is active.
 */
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (event) => setPrefersReducedMotion(event.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;
