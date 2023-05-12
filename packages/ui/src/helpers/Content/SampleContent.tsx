import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
  disableStripes?: boolean
  label?: string
  children?: React.ReactNode
}

/**
 * A sample content component that can be used to see how a component looks when there is content inside of it.
 */
export const SampleContent: FC<Props> = ({
  className,
  disableStripes = false,
  children,
  label
}) => {
  return (
    <div
      className={twMerge(
        'relative overflow-auto rounded-xl border border-dashed border-gray-400 opacity-75',
        className
      )}
    >
      <div className="absolute top-3 left-4 text-sm">{label}</div>

      {!disableStripes && (
        <svg className="absolute inset-0 h-full w-full stroke-gray-900/10" fill="none">
          <defs>
            <pattern
              id="pattern-diagonal-lines"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
            </pattern>
          </defs>
          <rect fill="url(#pattern-diagonal-lines)" className="stroke-none h-full w-full"></rect>
        </svg>
      )}
      {children}
    </div>
  )
}
