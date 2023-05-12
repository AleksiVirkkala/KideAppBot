import { useEffect, useRef, useState } from 'react'
import interact from 'interactjs'
import type { ResizeEvent } from '@interactjs/actions/resize/plugin'

interface ResizableContainerProps {
  children: React.ReactNode
  initialWidth?: number
  minWidth?: number
  fullSize?: boolean
  containerClassName?: string
}

/**
 * Horizontally resizable container.
 *
 * This component can be used to test how a component responds to changes in its width.
 *
 * Unfortunately because Storybook sets it inside the iframe that contains the story,
 * Resizing the container will not trigger css breakpoints.
 */
export const ResizableContainer = ({
  children,
  initialWidth,
  minWidth = 100,
  fullSize = false,
  containerClassName
}: ResizableContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    if (initialWidth) container.style.width = `${initialWidth}px`

    const interactable = initInteract(container, minWidth)
    return () => {
      interactable.unset()
    }
  }, [initialWidth, minWidth])

  return (
    <div ref={containerRef} className="flex">
      <div
        className={twMerge(
          'w-full overflow-hidden rounded-lg ring-1 ring-slate-900/10',
          isResizing && 'pointer-events-none',
          !fullSize && 'p-4',
          containerClassName
        )}
      >
        {children}
      </div>
      <div className="flex items-center px-2">
        <div className="h-8 w-1.5 rounded-full bg-slate-400"></div>
      </div>
    </div>
  )
}

const initInteract = (container: HTMLElement, minWidth: number) => {
  return interact(container).resizable({
    edges: { right: true },
    listeners: {
      move(event: ResizeEvent) {
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`
        })
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),
      // minimum size
      interact.modifiers.restrictSize({
        min: { width: minWidth, height: 50 }
      })
    ]
  })
}
