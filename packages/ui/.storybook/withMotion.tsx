import { MotionConfig } from 'framer-motion';
import { useReducedMotion } from '@common/utils/react';

export const motionGlobals = {
  name: 'Motion',
  description: 'Test accessibility with reduced motion',
  toolbar: {
    icon: 'lightning',
    dynamicTitle: true,
    items: ['always', 'never', 'user']
  }
} as const;

type ReducedMotionConfig = 'always' | 'never' | 'user';

const getReducedMotionValue = (contextValue: ReducedMotionConfig): ReducedMotionConfig => {
  // If user has picked a value from the toolbar, use that
  if (contextValue !== 'user') {
    return contextValue;
  }
  // Otherwise, use the user's OS preference
  const prefersReduced = useReducedMotion();
  return prefersReduced ? 'always' : 'never';
};

export const withMotion = (Story, context) => {
  const { motion }: { motion: ReducedMotionConfig } = context.globals;
  const reducedMotionValue = getReducedMotionValue(motion);

  return (
    <MotionConfig reducedMotion={reducedMotionValue}>
      <Story />
    </MotionConfig>
  );
};
