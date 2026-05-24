import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { World } from '../types/world'

interface AtlasConnectionsProps {
  worlds: World[]
}

// Builds a smooth CatmullRom curve from a world position toward the Gauntlet,
// curving through a midpoint that gives it an arc rather than a straight line.
function buildArcToGauntlet(
  from: THREE.Vector3,
  to: THREE.Vector3
): THREE.CatmullRomCurve3 {
  const mid = from.clone().lerp(to, 0.5)
  // Push midpoint slightly toward camera (positive Z) and slightly inward (toward center)
  mid.x *= 0.5
  mid.y *= 0.5
  mid.z += 1.5
  return new THREE.CatmullRomCurve3([from, mid, to], false, 'catmullrom', 0.5)
}

// Animated particle that travels along a curve
function TraceParticle({
  curve,
  speed,
  offset,
  color,
}: {
  curve: THREE.CatmullRomCurve3
  speed: number
  offset: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = ((state.clock.elapsedTime * speed + offset) % 1 + 1) % 1
    const pos = curve.getPoint(t)
    meshRef.current.position.copy(pos)
    // Fade out near ends, bright in the middle
    const fade = Math.sin(t * Math.PI)
    ;(meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = fade * 1.8
    ;(meshRef.current.material as THREE.MeshStandardMaterial).opacity = fade * 0.7
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

export function AtlasConnections({ worlds }: AtlasConnectionsProps) {
  const gauntlet = worlds.find((w) => w.id === 'the-gauntlet')
  if (!gauntlet) return null

  const gauntletPos = new THREE.Vector3(...gauntlet.position)

  const connections = useMemo(() => {
    return worlds
      .filter((w) => w.id !== 'the-gauntlet')
      .map((world) => {
        const fromPos = new THREE.Vector3(...world.position)
        const curve = buildArcToGauntlet(fromPos, gauntletPos)

        // Build static line geometry along the curve
        const points = curve.getPoints(60)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        return { world, curve, geometry }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worlds])

  return (
    <group>
      {connections.map(({ world, curve, geometry }) => {
        const isActive = world.state !== 'locked'
        const lineColor = world.accent
        const lineOpacity = isActive ? 0.12 : 0.05

        return (
          <group key={world.id}>
            {/* Static arc line — always present, barely visible */}
            <line geometry={geometry}>
              <lineBasicMaterial
                color={lineColor}
                transparent
                opacity={lineOpacity}
                depthWrite={false}
              />
            </line>

            {/* Traveling particles — only on active worlds */}
            {isActive && (
              <>
                <TraceParticle
                  curve={curve}
                  speed={0.07}
                  offset={0}
                  color={lineColor}
                />
                <TraceParticle
                  curve={curve}
                  speed={0.07}
                  offset={0.4}
                  color={lineColor}
                />
                <TraceParticle
                  curve={curve}
                  speed={0.07}
                  offset={0.7}
                  color={lineColor}
                />
              </>
            )}
          </group>
        )
      })}
    </group>
  )
}
