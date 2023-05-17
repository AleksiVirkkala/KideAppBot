import {
  AnimatePresence,
  AnimatePresenceProps,
  motion,
  useReducedMotionConfig,
  Variants
} from 'framer-motion';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

type Mode = AnimatePresenceProps['mode'];

interface ExpandTransitionProps {
  children: React.ReactNode;
  expanded: boolean;
  mode?: Mode;
  className?: string;
}

export const ExpandTransition: FC<ExpandTransitionProps> = ({
  children,
  expanded,
  mode: modeProp,
  className
}) => {
  const prefersReducedMotion = useReducedMotionConfig();
  const mode: Mode = modeProp || (prefersReducedMotion ? 'popLayout' : undefined);

  const variants: Variants = {
    expanded: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 }
  };
  const reducedMotionVariants: Variants = {
    expanded: { opacity: 1 },
    collapsed: { opacity: 0 }
  };

  return (
    <>
      <AnimatePresence mode={mode}>
        {expanded && (
          <motion.div
            className={twMerge('overflow-hidden', className)}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={prefersReducedMotion ? reducedMotionVariants : variants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
