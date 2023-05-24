'use client';

import { BotLogo, GitHubLogo } from '../../assets/Logos';
import Link from 'next/link';
import { ElementType, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { MenuButton } from './MenuButton';
import { AppBarContent, AppBarShell } from './AppBarShell';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';

export interface NavigationOption {
  label: string;
  href: string;
  isActive: boolean;
}

const AppLogoLink = () => (
  <Link
    href="/"
    className="flex items-center space-x-3 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
  >
    <AccessibleIcon label="Bot Logo">
      <BotLogo className="mb-1 block h-7 w-auto fill-indigo-500" />
    </AccessibleIcon>
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
  <span className="font-mono text-sm text-zinc-700 opacity-50">{children}</span>
);

const NavItem: FC<{ option: NavigationOption; className?: string }> = ({ option, className }) => (
  <Link
    href={option.href}
    className={twMerge(
      option.isActive ? 'bg-zinc-500/10' : 'text-zinc-700 hover:bg-zinc-500/5 hover:text-zinc-900',
      'rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10',
      className
    )}
    aria-current={option.isActive ? 'page' : undefined}
  >
    {option.label}
  </Link>
);

const DesktopNavigation: FC<{ options: NavigationOption[]; className?: string }> = ({
  options,
  className
}) => (
  <div className={twMerge('ml-6', className)}>
    <nav className="flex space-x-4">
      {options.map(option => (
        <NavItem key={option.label} option={option} />
      ))}
    </nav>
  </div>
);
const MobileNavigation: FC<{ options: NavigationOption[]; className?: string }> = ({
  options,
  className
}) => (
  <div className={className}>
    <nav className="space-y-1 px-2 pb-3 pt-2">
      {options.map(option => (
        <NavItem key={option.label} option={option} className="block" />
      ))}
    </nav>
  </div>
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
  logo = <AppLogoLink />,
  as,
  className
}: AppBarProps) => {
  const collapsibleContent: AppBarContent = () => (
    <MobileNavigation options={navigationOptions} className="sm:hidden" />
  );
  return (
    <AppBarShell
      as={as}
      collapsibleContent={collapsibleContent}
      className={twMerge('backdrop-blur-sm', className)}
    >
      {({ isExpanded }) => (
        <div className="relative flex h-16 items-center justify-between">
          <NavLeft>
            <MenuButton isOpen={isExpanded} />
          </NavLeft>
          <NavMain>
            {logo}
            <DesktopNavigation options={navigationOptions} className="hidden sm:block" />
          </NavMain>
          <NavRight>
            <VersionNumber>{versionNumber}</VersionNumber>
            <GitHubLink />
          </NavRight>
        </div>
      )}
    </AppBarShell>
  );
};

AppBar.NavItem = NavItem;
