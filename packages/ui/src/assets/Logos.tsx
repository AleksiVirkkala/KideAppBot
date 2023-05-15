import { FC, SVGProps } from 'react';
import { twMerge } from 'tailwind-merge';

// I definitely don't like this method but I want the SVG to be stylable and included in the bundle.
// Unfortunately to achieve this in a simple way I found this to be the best solution. *

export const BotLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 183 248.3" {...props}>
    <polygon points="35.3 22.2 19.2 0 0 22.2 0 123.8 36.2 85 35.3 22.2" />
    <path d="m87.1,58.5L0,145.7v80.5l16.5,22,19.7-21.7v-34.8l53.1,54,93.6-92.3L87.1,58.5Zm-36.6,92.3l37.8-37.8,40.7,40.3-38.2,37.8-40.3-40.4Z" />
  </svg>
);

const BotLogoText: FC<React.HTMLProps<HTMLSpanElement>> = ({ className, ...props }) => (
  <span {...props} className={twMerge('select-none text-xl', className)}>
    KideAppBot
  </span>
);

BotLogo.Text = BotLogoText;

export const GitHubLogo: FC<SVGProps<SVGSVGElement>> = props => (
  <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path>
  </svg>
);
