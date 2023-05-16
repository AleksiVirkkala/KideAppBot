import { MotionConfig } from 'framer-motion';

export const motionGlobals = {
  name: 'Motion',
  description: 'Test accessibility with reduced motion',
  toolbar: {
    icon: 'lightning',
    dynamicTitle: true,
    items: ['always', 'never', 'user']
  }
} as const;

export const withMotion = (Story, context) => {
  const { motion } = context.globals;
  return (
    <MotionConfig reducedMotion={motion}>
      <Story />
    </MotionConfig>
  );
};
