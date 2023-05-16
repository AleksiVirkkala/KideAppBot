import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

export const ExpandTransition: FC<{ children: React.ReactNode; expanded: boolean }> = ({
  children,
  expanded
}) => {
  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          className="overflow-hidden"
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          variants={{
            expanded: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
