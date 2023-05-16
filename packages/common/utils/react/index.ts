import { useState, useEffect } from 'react';

/**
 * Hook to detect if reduced motion is enabled.
 *
 * Automatically detect if the user has enabled reduced motion based on their OS settings.
 * This hook will update the value automatically if the user changes their OS settings.
 *
 * @author Luke Herrington
 * @see {@link https://github.com/infiniteluke/react-reduce-motion/blob/master/src/targets/web/index.js}
 */
export const useReducedMotion = () => {
  const [matches, setMatch] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setMatch(mq.matches);
    };
    handleChange();
    mq.addEventListener('change', handleChange);
    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, []);
  return matches;
};
