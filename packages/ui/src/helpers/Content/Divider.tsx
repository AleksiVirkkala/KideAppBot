import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface DividerProps {
  className?: string;
  vertical?: boolean;
}

export const Divider: FC<DividerProps> = ({ className, vertical = false }) => {
  return <div className={twMerge(vertical ? 'w-px' : 'h-px', 'bg-gray-200', className)} />;
};
