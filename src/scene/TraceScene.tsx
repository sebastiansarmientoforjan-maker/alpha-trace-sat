import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { WorldObject } from './WorldObject'
import { CameraRig } from './CameraRig'
import type { CameraState, WorldId } from '../types/world'
import type { World } from '../types/world'

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
      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.08} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} color="#e2e8f0" />
      <directionalLight position={[-8, -4, -6]} intensity={0.15} color="#1e293b" />

      {/* Subtle point lights for scene atmosphere */}
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#0D9488" distance={20} decay={2} />
      <pointLight position={[-10, 0, -5]} intensity={0.2} color="#10B981" distance={15} decay={2} />

      {/* Deep space stars */}
      <Stars
        radius={80}
        depth={60}
        count={2500}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Scene fog — creates depth and occludes locked worlds */}
      <fog attach="fog" args={['#0e0f11', 18, 45]} />

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

      {/* Camera choreography */}
      <CameraRig cameraState={cameraState} worlds={worlds} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.6}
          intensity={1.2}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.15} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
