import * as Collapsible from '@radix-ui/react-collapsible';
import { Dispatch, SetStateAction, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ExpandTransition } from '../../helpers/Motion/ExpandTransition';

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
  as: Wrapper = 'div',
  className,
  collapsibleContent: Content
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Wrapper
      className={twMerge('sticky inset-x-0 top-0 z-50 border-b-[1px] backdrop-blur-sm', className)}
    >
      <Collapsible.Root asChild open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <Children isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          {Content && (
            <ExpandTransition expanded={isExpanded}>
              <Collapsible.Content asChild>
                <Content isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
              </Collapsible.Content>
            </ExpandTransition>
          )}
        </div>
      </Collapsible.Root>
    </Wrapper>
  );
};
