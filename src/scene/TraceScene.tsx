import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { WorldObject } from './WorldObject'
import { CameraRig } from './CameraRig'
import type { CameraState, WorldId, World } from '../types/world'

interface TraceSceneProps {
  worlds: World[]
  cameraState: CameraState
  onHoverWorld: (id: WorldId) => void
  onUnhoverWorld: () => void
  onFocusWorld: (id: WorldId) => void
}

export function TraceScene({
  worlds,
  cameraState,
  onHoverWorld,
  onUnhoverWorld,
  onFocusWorld,
}: TraceSceneProps) {
  const hoveredId =
    cameraState.type === 'hover'
      ? (cameraState as { type: 'hover'; worldId: WorldId }).worldId
      : null

  const focusedId =
    cameraState.type === 'focus'
      ? (cameraState as { type: 'focus'; worldId: WorldId }).worldId
      : null

  return (
    <>
      {/* Scene ambient — kept very low so emissive worlds stand out */}
      <ambientLight intensity={0.05} />

      {/* Key light — cold, slightly above */}
      <directionalLight position={[8, 12, 6]} intensity={0.35} color="#c7d2fe" />
      {/* Fill light — warm and dim from below, creates subtle ground separation */}
      <directionalLight position={[-6, -3, -8]} intensity={0.1} color="#1e1b4b" />

      {/* Gauntlet backlight — always present, platinum-cold, draws the eye */}
      <pointLight position={[0, 4, -10]} intensity={0.8} color="#e2e8f0" distance={22} decay={2} />

      {/* Stars — sparse, desaturated, stay in background */}
      <Stars
        radius={90}
        depth={70}
        count={2000}
        factor={2.5}
        saturation={0}
        fade
        speed={0.2}
      />

      {/* Fog — near plane at 22 prevents worlds from popping in; far plane at 50 occludes the back */}
      <fog attach="fog" args={['#0a0b0d', 22, 50]} />

      {/* World objects */}
      {worlds.map((world) => (
        <WorldObject
          key={world.id}
          world={world}
          isHovered={hoveredId === world.id}
          isFocused={focusedId === world.id}
          onHover={onHoverWorld}
          onUnhover={onUnhoverWorld}
          onFocus={onFocusWorld}
        />
      ))}

      <CameraRig cameraState={cameraState} worlds={worlds} />

      {/* Post-processing — bloom only on what's already bright, vignette pulls attention inward */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.5}
          intensity={1.6}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.12} darkness={0.75} />
      </EffectComposer>
    </>
  )
}
