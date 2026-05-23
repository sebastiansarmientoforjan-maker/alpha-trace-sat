export type WorldState = 'locked' | 'active' | 'mastered'

export type WorldId =
  | 'intersection-protocol'
  | 'regression-core'
  | 'parameter-control'
  | 'geometry-sector'
  | 'the-gauntlet'

export interface World {
  id: WorldId
  name: string
  subtitle: string
  accent: string
  position: [number, number, number]
  state: WorldState
  chaptersTotal: number
  chaptersCompleted: number
  description: string
}

export type CameraState =
  | { type: 'idle' }
  | { type: 'hover'; worldId: WorldId }
  | { type: 'focus'; worldId: WorldId }
  | { type: 'enter'; worldId: WorldId }
