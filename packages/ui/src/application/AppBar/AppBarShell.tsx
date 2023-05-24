import * as Collapsible from '@radix-ui/react-collapsible';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ExpandTransition } from '../../helpers/Motion/ExpandTransition';
import { useOnClickOutside } from 'usehooks-ts';

export type AppBarContent = React.FC<{
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}>;

interface AppBarShellProps {
  children: AppBarContent;
  collapsibleContent?: AppBarContent;
  className?: string;
  as?: React.ElementType;
}

/**
 * AppBar Shell
 *
 * This component has 2 primary content areas:
 * - The bar itself
 * - Content that can be expanded below the bar
 */
export const AppBarShell: React.FC<AppBarShellProps> = ({
  children: Children,
  as: Wrapper = 'header',
  className,
  collapsibleContent: Content
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const appBarRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(appBarRef, () => setIsExpanded(false));

  return (
    <Collapsible.Root asChild open={isExpanded} ref={appBarRef} onOpenChange={setIsExpanded}>
      <Wrapper className="sticky inset-x-0 top-0 z-50">
        {/* Static blocking content */}
        <div className={className}>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <Children isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          </div>
        </div>
        {/* Border will be visible even when menu is closed */}
        <div className={twMerge('absolute inset-x-0 border-b-[1px]', className)}>
          {/* Dynamically shown "floating" content */}
          {Content && (
            <ExpandTransition
              expanded={isExpanded}
              className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"
            >
              <Collapsible.Content asChild>
                <Content isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
              </Collapsible.Content>
            </ExpandTransition>
          )}
        </div>
      </Wrapper>
    </Collapsible.Root>
  );
};
