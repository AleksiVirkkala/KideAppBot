'use client';

import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ children, disabled = false, className }: ButtonProps) => {
  return (
    <motion.button
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      className={twMerge(
        'select-none rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-gray-300 disabled:text-gray-500',
        className
      )}
    >
      {children}
    </motion.button>
  );
};
