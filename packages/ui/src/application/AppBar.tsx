'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BotLogo, GitHubLogo } from '../assets/Logos';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { ElementType, FC, Fragment } from 'react';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

export interface NavigationOption {
  label: string;
  href: string;
  isActive: boolean;
}

const AppLogo = () => (
  <Link
    href="/"
    className="flex items-center space-x-3 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
  >
    <BotLogo className="mb-1 block h-7 w-auto fill-indigo-500" />
    <BotLogo.Text className="hidden sm:block" />
  </Link>
);
const GitHubLink = () => (
  <a
    href="https://github.com/AleksiVirkkala/KideAppBot"
    className="rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
  >
    <GitHubLogo className="block h-7 fill-zinc-700 hover:fill-zinc-950" />
  </a>
);

const NavLeft: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">{children}</div>
);
const NavMain: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
    {children}
  </div>
);
const NavRight: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
    {children}
  </div>
);

const VersionNumber: FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-w font-mono text-sm text-zinc-700 opacity-50">{children}</span>
);

const DesktopNavigation: FC<{ options: NavigationOption[]; className?: string }> = ({
  options,
  className
}) => (
  <div className={twMerge('ml-6', className)}>
    <div className="flex space-x-4">
      {options.map(option => (
        <Link
          key={option.label}
          href={option.href}
          className={twMerge(
            option.isActive
              ? 'bg-zinc-500/10'
              : 'text-zinc-700 hover:bg-zinc-500/5 hover:text-zinc-900',
            'rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10'
          )}
          aria-current={option.isActive ? 'page' : undefined}
        >
          {option.label}
        </Link>
      ))}
    </div>
  </div>
);

const MobileNavigation: FC<{ options: NavigationOption[]; className?: string }> = ({
  options,
  className
}) => (
  <Disclosure.Panel
    static
    as={motion.div}
    className={className}
    initial="collapsed"
    animate="open"
    exit="collapsed"
    variants={{
      open: { opacity: 1, height: 'auto' },
      collapsed: { opacity: 0, height: 0 }
    }}
  >
    <div className="space-y-1 px-2 pb-3 pt-2">
      {options.map(option => (
        <Disclosure.Button
          key={option.label}
          as={Link}
          href={option.href}
          className={twMerge(
            option.isActive
              ? 'bg-zinc-500/10'
              : 'text-zinc-700 hover:bg-zinc-500/5 hover:text-zinc-900',
            'block rounded-md px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10'
          )}
          aria-current={option.isActive ? 'page' : undefined}
        >
          {option.label}
        </Disclosure.Button>
      ))}
    </div>
  </Disclosure.Panel>
);
const MobileMenuButton: FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-500/5 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500/10">
    <span className="sr-only">Open main menu</span>
    {isOpen ? (
      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
    ) : (
      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
    )}
  </Disclosure.Button>
);

interface AppBarProps {
  navigationOptions: NavigationOption[];
  versionNumber?: string;
  as?: ElementType;
  className?: string;
  logo?: React.ReactNode;
}

export const AppBar = ({
  navigationOptions,
  versionNumber,
  as: Wrapper = 'nav',
  className,
  logo: Logo = <AppLogo />
}: AppBarProps) => {
  return (
    <Wrapper className={twMerge('sticky inset-x-0 top-0 z-50 backdrop-blur-sm', className)}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Disclosure as={Fragment}>
          {({ open }) => (
            <>
              <div className="relative flex h-16 items-center justify-between">
                <NavLeft>
                  <MobileMenuButton isOpen={open} />
                </NavLeft>
                <NavMain>
                  {Logo}
                  <DesktopNavigation options={navigationOptions} className="hidden sm:block" />
                </NavMain>
                <NavRight>
                  <VersionNumber>{versionNumber}</VersionNumber>
                  <GitHubLink />
                </NavRight>
              </div>
              <AnimatePresence initial={false}>
                {open && (
                  <MobileNavigation
                    options={navigationOptions}
                    className="overflow-y-hidden sm:hidden"
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </Disclosure>
      </div>
      {/* Separator line at AppBar bottom */}
      <div className="absolute inset-x-0 top-full h-px bg-zinc-900/10" />
    </Wrapper>
  );
};
