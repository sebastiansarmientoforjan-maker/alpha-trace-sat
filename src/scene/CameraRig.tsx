import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { CameraState, WorldId, World } from '../types/world'

// Camera config per state
const IDLE_POSITION = new THREE.Vector3(0, 3.5, 13)
const IDLE_LOOK = new THREE.Vector3(0, 0.5, -1)

// For focus: camera approaches from a slightly elevated angle, not straight on
// Each world gets a bespoke offset so the approach feels unique to its position
function getFocusPosition(world: World): THREE.Vector3 {
  const [wx, wy, wz] = world.position
  const worldPos = new THREE.Vector3(wx, wy, wz)

  // Direction from origin to world, then back off ~4.5 units + slight elevation
  const dir = worldPos.clone().normalize()
  const focusPos = worldPos.clone().sub(dir.multiplyScalar(-4.5))
  focusPos.y += 1.2
  focusPos.z = Math.max(focusPos.z, wz + 4)
  return focusPos
}

function getFocusLook(world: World): THREE.Vector3 {
  const [wx, wy, wz] = world.position
  return new THREE.Vector3(wx, wy + 0.2, wz)
}

function getHoverPosition(world: World): THREE.Vector3 {
  const [wx, wy, wz] = world.position
  const worldPos = new THREE.Vector3(wx, wy, wz)
  // Nudge 18% toward the world from idle
  return IDLE_POSITION.clone().lerp(worldPos, 0.18)
}

function getHoverLook(world: World): THREE.Vector3 {
  const [wx, wy, wz] = world.position
  // Look between center and world
  return IDLE_LOOK.clone().lerp(new THREE.Vector3(wx, wy, wz), 0.3)
}

// FOV per state — tighter on focus for cinematic framing
const FOV_IDLE = 60
const FOV_HOVER = 58
const FOV_FOCUS = 48

interface CameraRigProps {
  cameraState: CameraState
  worlds: World[]
}

export function CameraRig({ cameraState, worlds }: CameraRigProps) {
  const { camera } = useThree()
  const perspCamera = camera as THREE.PerspectiveCamera

  const currentPos = useRef(IDLE_POSITION.clone())
  const currentLook = useRef(IDLE_LOOK.clone())
  const currentFov = useRef(FOV_IDLE)

  // Different lerp speeds: quick response on hover, slower cinematic pull on focus
  const LERP_IDLE = 0.035
  const LERP_HOVER = 0.05
  const LERP_FOCUS = 0.028
  const LERP_FOV = 0.04

  useFrame(() => {
    let targetPos: THREE.Vector3
    let targetLook: THREE.Vector3
    let targetFov: number
    let lerpSpeed: number

    if (cameraState.type === 'idle') {
      targetPos = IDLE_POSITION
      targetLook = IDLE_LOOK
      targetFov = FOV_IDLE
      lerpSpeed = LERP_IDLE
    } else {
      const worldId = (cameraState as { type: string; worldId: WorldId }).worldId
      const world = worlds.find((w) => w.id === worldId)

      if (!world) {
        targetPos = IDLE_POSITION
        targetLook = IDLE_LOOK
        targetFov = FOV_IDLE
        lerpSpeed = LERP_IDLE
      } else if (cameraState.type === 'hover') {
        targetPos = getHoverPosition(world)
        targetLook = getHoverLook(world)
        targetFov = FOV_HOVER
        lerpSpeed = LERP_HOVER
      } else {
        // focus or enter
        targetPos = getFocusPosition(world)
        targetLook = getFocusLook(world)
        targetFov = FOV_FOCUS
        lerpSpeed = LERP_FOCUS
      }
    }

    currentPos.current.lerp(targetPos, lerpSpeed)
    currentLook.current.lerp(targetLook, lerpSpeed)
    currentFov.current += (targetFov - currentFov.current) * LERP_FOV

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLook.current)
    perspCamera.fov = currentFov.current
    perspCamera.updateProjectionMatrix()
  })

  return null
}
