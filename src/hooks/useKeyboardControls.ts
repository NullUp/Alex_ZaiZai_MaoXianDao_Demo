import { useEffect, useRef } from 'react'

export type KeyMap = Set<string>

export function useKeyboardControls(onAction?: (code: string) => void) {
  const keysRef = useRef<KeyMap>(new Set())
  const actionRef = useRef(onAction)

  actionRef.current = onAction

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const actionable = ['KeyE', 'KeyR', 'KeyH', 'KeyM']
      if (actionable.includes(event.code) && !keysRef.current.has(event.code)) {
        actionRef.current?.(event.code)
      }
      keysRef.current.add(event.code)
    }

    const up = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code)
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return keysRef
}

