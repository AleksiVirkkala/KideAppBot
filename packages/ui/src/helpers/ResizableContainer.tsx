interface ResizableContainerProps {
  children: React.ReactNode
  className?: string
}

export const ResizableContainer = ({
  children,
  className = '',
  ...props
}: ResizableContainerProps) => {
  return (
    <div className={`flex flex-col ${className}`} {...props}>
      {children}
    </div>
  )
}
