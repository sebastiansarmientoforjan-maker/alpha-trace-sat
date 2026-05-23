import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { CameraState, WorldId } from '../types/world'
import type { World } from '../types/world'

const CAMERA_POSITIONS: Record<string, THREE.Vector3> = {
  idle: new THREE.Vector3(0, 3, 12),
}

function getTargetPosition(cameraState: CameraState, worlds: World[]): THREE.Vector3 {
  if (cameraState.type === 'idle') {
    return CAMERA_POSITIONS.idle
  }

  const worldId = (cameraState as { type: string; worldId: WorldId }).worldId
  const world = worlds.find((w) => w.id === worldId)
  if (!world) return CAMERA_POSITIONS.idle

  const [wx, wy, wz] = world.position
  const worldPos = new THREE.Vector3(wx, wy, wz)

  if (cameraState.type === 'hover') {
    const dir = worldPos.clone().normalize()
    return CAMERA_POSITIONS.idle.clone().lerp(
      worldPos.clone().add(dir.multiplyScalar(6)),
      0.25
    )
  }

  if (cameraState.type === 'focus') {
    const offset = new THREE.Vector3(0, 0.5, 3.5)
    return worldPos.clone().add(offset)
  }

  return CAMERA_POSITIONS.idle
}

function getLookTarget(cameraState: CameraState, worlds: World[]): THREE.Vector3 {
  if (cameraState.type === 'idle') return new THREE.Vector3(0, 0, 0)

  const worldId = (cameraState as { type: string; worldId: WorldId }).worldId
  const world = worlds.find((w) => w.id === worldId)
  if (!world) return new THREE.Vector3(0, 0, 0)

  return new THREE.Vector3(...world.position)
}

interface CameraRigProps {
  cameraState: CameraState
  worlds: World[]
}

export function CameraRig({ cameraState, worlds }: CameraRigProps) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 3, 12))
  const currentLook = useRef(new THREE.Vector3(0, 0, 0))
  const LERP_SPEED = 0.04

  useFrame(() => {
    const desired = getTargetPosition(cameraState, worlds)
    const desiredLook = getLookTarget(cameraState, worlds)

    targetPos.current.lerp(desired, LERP_SPEED)
    currentLook.current.lerp(desiredLook, LERP_SPEED)

    camera.position.copy(targetPos.current)
    camera.lookAt(currentLook.current)
  })

  return null
}
