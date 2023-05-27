import { XMarkIcon, Bars3Icon } from '@heroicons/react/20/solid';
import { FC } from 'react';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';

export const MenuButton: FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <CollapsibleTrigger className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-500/5 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500/10">
    <span className="sr-only">Open main menu</span>
    {isOpen ? (
      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
    ) : (
      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
    )}
  </CollapsibleTrigger>
);
