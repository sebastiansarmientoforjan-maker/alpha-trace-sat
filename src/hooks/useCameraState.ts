import { useState, useCallback } from 'react'
import type { CameraState, WorldId } from '../types/world'

export function useCameraState() {
  const [cameraState, setCameraState] = useState<CameraState>({ type: 'idle' })

  const hoverWorld = useCallback((worldId: WorldId) => {
    setCameraState((prev) => {
      if (prev.type === 'idle' || (prev.type === 'hover' && prev.worldId !== worldId)) {
        return { type: 'hover', worldId }
      }
      return prev
    })
  }, [])

  const unhoverWorld = useCallback(() => {
    setCameraState((prev) => (prev.type === 'hover' ? { type: 'idle' } : prev))
  }, [])

  const focusWorld = useCallback((worldId: WorldId) => {
    setCameraState({ type: 'focus', worldId })
  }, [])

  const returnToIdle = useCallback(() => {
    setCameraState({ type: 'idle' })
  }, [])

  const enterWorld = useCallback((worldId: WorldId) => {
    setCameraState({ type: 'enter', worldId })
  }, [])

  return { cameraState, hoverWorld, unhoverWorld, focusWorld, returnToIdle, enterWorld }
}
