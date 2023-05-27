import { Collapsible, CollapsibleContent } from '@radix-ui/react-collapsible';
import { Dispatch, SetStateAction, createContext, useContext, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ExpandTransition } from '../../helpers/Motion/ExpandTransition';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { Slot } from '@radix-ui/react-slot';

export const AppBarContext = createContext<{
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}>({
  isExpanded: false,
  setIsExpanded: () => undefined
});

interface AppBarShellProps {
  children: React.ReactNode;
  collapsibleContent: React.ReactNode;
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
export const AppBarShell = ({
  children,
  as: Wrapper = 'header',
  className,
  collapsibleContent
}: AppBarShellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const appBarRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(appBarRef, () => setIsExpanded(false));

  return (
    <AppBarContext.Provider value={{ isExpanded, setIsExpanded }}>
      <Collapsible asChild open={isExpanded} ref={appBarRef} onOpenChange={setIsExpanded}>
        <Wrapper className="sticky inset-x-0 top-0 z-50">
          {/* Static blocking content */}
          <div className={className}>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">{children}</div>
          </div>
          {/* Border will be visible even when menu is closed */}
          <div className={twMerge('absolute inset-x-0 border-b-[1px]', className)}>
            {/* Dynamically shown "floating" content */}
            {collapsibleContent && (
              <ExpandTransition
                expanded={isExpanded}
                className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"
              >
                <CollapsibleContent asChild>{collapsibleContent}</CollapsibleContent>
              </ExpandTransition>
            )}
          </div>
        </Wrapper>
      </Collapsible>
    </AppBarContext.Provider>
  );
};

interface TriggerProps {
  className?: string;
  children: React.ReactNode;
}

const CloseTrigger = ({ children, className }: TriggerProps) => {
  const { setIsExpanded } = useContext(AppBarContext);

  const childRef = useRef<HTMLElement>(null);
  useEventListener('click', () => setIsExpanded(false), childRef);

  return (
    <Slot className={className} ref={childRef}>
      {children}
    </Slot>
  );
};

AppBarShell.CloseTrigger = CloseTrigger;
