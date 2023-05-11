import { FC } from 'react'

interface DividerProps {
  className?: string
  vertical?: boolean
}

export const Divider: FC<DividerProps> = ({ className = '', vertical = false }) => {
  return <div className={`${vertical ? 'w-px' : 'h-px'} bg-gray-200 ${className}`} />
}
