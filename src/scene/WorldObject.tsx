import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { World, WorldId } from '../types/world'

interface WorldObjectProps {
  world: World
  isHovered: boolean
  isFocused: boolean
  onHover: (id: WorldId) => void
  onUnhover: () => void
  onFocus: (id: WorldId) => void
}

// ─── INTERSECTION PROTOCOL ───────────────────────────────────────────────────
// Identity: two wire planes intersecting at precise angles — the crossing IS the object
function IntersectionProtocolGeometry({ color, isHovered, isFocused, isLocked }: {
  color: string; isHovered: boolean; isFocused: boolean; isLocked: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const speed = isLocked ? 0.002 : isHovered || isFocused ? 0.012 : 0.004
    groupRef.current.rotation.y += delta * speed * 60
  })

  const emissive = isLocked ? 0 : isFocused ? 1.8 : isHovered ? 1.1 : 0.5
  const mat = { color, emissive: color, emissiveIntensity: emissive, wireframe: !isLocked }
  const lockedMat = { color: '#1F2937', emissive: '#111827', emissiveIntensity: 0.1, wireframe: true }
  const activeMat = isLocked ? lockedMat : mat

  return (
    <group ref={groupRef}>
      {/* Primary plane — vertical */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[1.6, 1.6, 5, 5]} />
        <meshStandardMaterial {...activeMat} side={THREE.DoubleSide} transparent opacity={isLocked ? 0.25 : 0.85} />
      </mesh>
      {/* Secondary plane — tilted 72° */}
      <mesh rotation={[0, Math.PI * 0.4, 0]}>
        <planeGeometry args={[1.6, 1.6, 5, 5]} />
        <meshStandardMaterial {...activeMat} side={THREE.DoubleSide} transparent opacity={isLocked ? 0.15 : 0.6} />
      </mesh>
      {/* Intersection spine — the actual crossing line */}
      {!isLocked && (
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 2.2, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isFocused ? 3 : 1.5} />
        </mesh>
      )}
    </group>
  )
}

// ─── REGRESSION CORE ─────────────────────────────────────────────────────────
// Identity: a dense point cloud around an orbital core — data gravity made visible
function RegressionCoreGeometry({ color, isHovered, isFocused, isLocked }: {
  color: string; isHovered: boolean; isFocused: boolean; isLocked: boolean
}) {
  const coreRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)

  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 28; i++) {
      const t = i / 28
      const x = (Math.random() - 0.5) * 2.8
      const y = t * 1.8 - 0.9 + (Math.random() - 0.5) * 0.35
      const z = (Math.random() - 0.5) * 0.5
      pts.push([x, y, z])
    }
    return pts
  }, [])

  useFrame((_, delta) => {
    if (coreRef.current) {
      const s = isLocked ? 0.001 : isHovered || isFocused ? 0.01 : 0.004
      coreRef.current.rotation.y += delta * s * 60
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * (isLocked ? 0.001 : 0.006) * 60
      orbitRef.current.rotation.x += delta * 0.002 * 60
    }
  })

  const coreEmissive = isLocked ? 0.05 : isFocused ? 1.5 : isHovered ? 0.9 : 0.45

  return (
    <group>
      {/* Central core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial
          color={isLocked ? '#1F2937' : color}
          emissive={isLocked ? '#111827' : color}
          emissiveIntensity={coreEmissive}
          roughness={isLocked ? 0.95 : 0.15}
          metalness={isLocked ? 0 : 0.85}
        />
      </mesh>
      {/* Orbital arc ring */}
      <group ref={orbitRef}>
        <mesh rotation={[Math.PI * 0.15, 0, Math.PI * 0.1]}>
          <torusGeometry args={[0.9, isLocked ? 0.008 : 0.018, 8, 80]} />
          <meshStandardMaterial
            color={isLocked ? '#374151' : color}
            emissive={isLocked ? '#374151' : color}
            emissiveIntensity={isLocked ? 0 : isFocused ? 2.5 : isHovered ? 1.6 : 0.8}
            transparent opacity={isLocked ? 0.2 : 1}
          />
        </mesh>
      </group>
      {/* Data point scatter — only active */}
      {!isLocked && points.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isFocused ? 2 : isHovered ? 1.2 : 0.6}
          />
        </mesh>
      ))}
      {/* Fitted curve arc */}
      {!isLocked && (
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.1, 0.012, 8, 60, Math.PI * 1.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isFocused ? 2 : 1} />
        </mesh>
      )}
    </group>
  )
}

// ─── PARAMETER CONTROL ───────────────────────────────────────────────────────
// Identity: three parallel rails with a sliding band — modulation frozen in space
function ParameterControlGeometry({ color, isHovered, isFocused, isLocked }: {
  color: string; isHovered: boolean; isFocused: boolean; isLocked: boolean
}) {
  const sliderRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      const s = isLocked ? 0.001 : 0.003
      groupRef.current.rotation.y += delta * s * 60
    }
    if (sliderRef.current && !isLocked) {
      sliderRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.55
    }
  })

  const railColor = isLocked ? '#1F2937' : color
  const railEmissive = isLocked ? 0.05 : isFocused ? 1.8 : isHovered ? 1.1 : 0.5

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Three rails */}
      {[-0.55, 0, 0.55].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 2.2, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={railColor}
            emissive={railColor}
            emissiveIntensity={railEmissive * (i === 1 ? 1 : 0.5)}
            transparent opacity={isLocked ? 0.3 : 1}
          />
        </mesh>
      ))}
      {/* Sliding indicator — middle rail */}
      {!isLocked && (
        <mesh ref={sliderRef} position={[0, 0, 0.05]}>
          <boxGeometry args={[0.12, 0.38, 0.08]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isFocused ? 3 : isHovered ? 2 : 1.2}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      )}
      {/* Rail end caps */}
      {!isLocked && [-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.06, 1.4, 0.06]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ─── GEOMETRY SECTOR ─────────────────────────────────────────────────────────
// Identity: concentric rings at different orientations — pure radial geometry
function GeometrySectorGeometry({ color, isHovered, isFocused, isLocked }: {
  color: string; isHovered: boolean; isFocused: boolean; isLocked: boolean
}) {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    const s = isLocked ? 0.001 : isHovered || isFocused ? 0.01 : 0.004
    if (ring1.current) ring1.current.rotation.z += delta * s * 60
    if (ring2.current) ring2.current.rotation.x -= delta * s * 40
    if (ring3.current) ring3.current.rotation.y += delta * s * 30
  })

  const ringEmissive = isLocked ? 0 : isFocused ? 2.5 : isHovered ? 1.6 : 0.8
  const ringColor = isLocked ? '#374151' : color
  const ringOpacity = isLocked ? 0.2 : 1

  return (
    <group>
      {/* Outer ring — equatorial */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.0, isLocked ? 0.01 : 0.022, 8, 80]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={ringEmissive} transparent opacity={ringOpacity} />
      </mesh>
      {/* Mid ring — tilted 60° */}
      <mesh ref={ring2} rotation={[Math.PI * 0.33, 0, 0]}>
        <torusGeometry args={[0.7, isLocked ? 0.008 : 0.018, 8, 60]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={ringEmissive * 0.8} transparent opacity={isLocked ? 0.15 : 0.9} />
      </mesh>
      {/* Inner ring — tilted 30° off Y */}
      <mesh ref={ring3} rotation={[0, 0, Math.PI * 0.17]}>
        <torusGeometry args={[0.42, isLocked ? 0.006 : 0.014, 8, 48]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={ringEmissive * 0.6} transparent opacity={isLocked ? 0.12 : 0.7} />
      </mesh>
      {/* Central point */}
      {!isLocked && (
        <mesh>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isFocused ? 4 : 2} />
        </mesh>
      )}
    </group>
  )
}

// ─── THE GAUNTLET ─────────────────────────────────────────────────────────────
// Identity: a sealed monolith — four converging arcs pointing inward, heavy and inaccessible
function GauntletGeometry({ color, isHovered, isFocused, isLocked }: {
  color: string; isHovered: boolean; isFocused: boolean; isLocked: boolean
}) {
  const coreRef = useRef<THREE.Mesh>(null)
  const gateRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.008 * 60
      coreRef.current.rotation.x += delta * 0.003 * 60
    }
    if (gateRef.current && !isLocked) {
      gateRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
    }
  })

  const lockedCoreEmissive = isHovered ? 0.3 : 0.08
  const unlockedEmissive = isFocused ? 2.5 : isHovered ? 1.8 : 1.0

  return (
    <group>
      {/* Central octahedron */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={isLocked ? '#292524' : color}
          emissive={isLocked ? '#1C1917' : color}
          emissiveIntensity={isLocked ? lockedCoreEmissive : unlockedEmissive}
          roughness={isLocked ? 0.8 : 0.1}
          metalness={isLocked ? 0.3 : 0.95}
        />
      </mesh>

      {/* Four converging gate pillars */}
      <group ref={gateRef}>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2
          const x = Math.cos(angle) * 1.2
          const z = Math.sin(angle) * 1.2
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.06, isLocked ? 1.8 : 1.4, 0.06]} />
              <meshStandardMaterial
                color={isLocked ? '#292524' : color}
                emissive={isLocked ? '#1C1917' : color}
                emissiveIntensity={isLocked ? 0.15 : isFocused ? 2 : 0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          )
        })}
        {/* Top bar connecting the four pillars — the seal */}
        <mesh position={[0, isLocked ? 0.9 : 0.7, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.025, 8, 40]} />
          <meshStandardMaterial
            color={isLocked ? '#44403C' : color}
            emissive={isLocked ? '#292524' : color}
            emissiveIntensity={isLocked ? 0.2 : isFocused ? 2.5 : 1.2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Lock indicator — pulsing when locked and hovered */}
      {isLocked && isHovered && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.5} />
        </mesh>
      )}
    </group>
  )
}

// ─── SHARED FLOAT ANIMATION ───────────────────────────────────────────────────
function FloatWrapper({ children, offset, isLocked }: {
  children: React.ReactNode; offset: number; isLocked: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    const amplitude = isLocked ? 0.04 : 0.1
    ref.current.position.y = Math.sin(Date.now() * 0.0007 + offset) * amplitude
  })
  return <group ref={ref}>{children}</group>
}

// ─── WORLD LABEL (HTML billboard) ────────────────────────────────────────────
// Not used — labels live in the HUD, not the 3D scene

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function WorldObject({ world, isHovered, isFocused, onHover, onUnhover, onFocus }: WorldObjectProps) {
  const isLocked = world.state === 'locked'
  const accentColor = isLocked ? '#374151' : world.accent

  const handleClick = () => {
    if (isLocked) return
    onFocus(world.id)
  }

  const sharedProps = {
    color: world.accent,
    isHovered,
    isFocused,
    isLocked,
  }

  const worldGeometry = (() => {
    switch (world.id) {
      case 'intersection-protocol': return <IntersectionProtocolGeometry {...sharedProps} />
      case 'regression-core':       return <RegressionCoreGeometry {...sharedProps} />
      case 'parameter-control':     return <ParameterControlGeometry {...sharedProps} />
      case 'geometry-sector':       return <GeometrySectorGeometry {...sharedProps} />
      case 'the-gauntlet':          return <GauntletGeometry {...sharedProps} />
    }
  })()

  return (
    <group
      position={world.position}
      onClick={handleClick}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(world.id) }}
      onPointerLeave={() => onUnhover()}
    >
      <FloatWrapper offset={world.position[0]} isLocked={isLocked}>
        {worldGeometry}
      </FloatWrapper>

      {/* World-level point light when hovered/focused */}
      {(isHovered || isFocused) && !isLocked && (
        <pointLight
          color={world.accent}
          intensity={isFocused ? 5 : 2.5}
          distance={8}
          decay={2}
        />
      )}

      {/* Subtle ambient glow for active worlds even at rest */}
      {!isLocked && !isHovered && !isFocused && (
        <pointLight
          color={world.accent}
          intensity={0.4}
          distance={4}
          decay={2}
        />
      )}
    </group>
  )
}
