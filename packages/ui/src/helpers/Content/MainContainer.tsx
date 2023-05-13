import { ElementType, FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: ElementType
}

/**
 * Basic container for application content
 *
 * This component has a maximum width which prevents content from stretching too far.
 * It does not have any horizontal padding when the width is small, therefore it is
 * recommended to use it together with ContentContainer component. The benefit of this
 * approach is that it is easy to add full width content e.g. dividers between sections.
 */
export const MainContainer: FC<ContainerProps> = ({ children, className, as: Tag = 'main' }) => {
  return (
    <Tag className={twMerge('mx-auto max-w-7xl py-6 sm:px-6 lg:px-8', className)}>{children}</Tag>
  )
}
