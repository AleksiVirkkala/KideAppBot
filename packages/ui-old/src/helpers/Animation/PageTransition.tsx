'use client';

import autoAnimate from '@formkit/auto-animate';
import { Slot } from '@radix-ui/react-slot';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const parent = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  });

  return (
    <div ref={parent} className={className}>
      <Slot key={pathName}>{children}</Slot>
    </div>
  );
};
