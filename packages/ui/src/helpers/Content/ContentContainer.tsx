import { FC } from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const ContentContainer: FC<ContainerProps> = ({ children, className = '' }) => {
  return <div className={`h-max px-4 py-6 sm:px-0 ${className}`}>{children}</div>
}
