import { Transition as HeadlessTransition } from '@headlessui/react'
import { useState } from 'react'

export const Transition = () => {
  const [isShowing, setIsShowing] = useState(false)

  return (
    <>
      <button onClick={() => setIsShowing(isShowing => !isShowing)}>Toggle</button>
      <HeadlessTransition show={isShowing}>I will appear and disappear.</HeadlessTransition>
    </>
  )
}
