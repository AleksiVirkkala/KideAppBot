import autoAnimate from '@formkit/auto-animate';
import { FC, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ExpandTransitionProps {
  children: React.ReactNode;
  expanded: boolean;
  className?: string;
}

export const ExpandTransition: FC<ExpandTransitionProps> = ({ children, expanded, className }) => {
  const parent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  });

  return (
    <div ref={parent} className={twMerge('overflow-hidden', className)}>
      {expanded && children}
    </div>
  );
};
