import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { World, WorldId, WorldState } from '../types/world'

interface WorldObjectProps {
  world: World
  isHovered: boolean
  isFocused: boolean
  onHover: (id: WorldId) => void
  onUnhover: () => void
  onFocus: (id: WorldId) => void
}

function getEmissiveIntensity(state: WorldState, isHovered: boolean, isFocused: boolean): number {
  if (state === 'locked') return 0.02
  if (isFocused) return 1.2
  if (isHovered) return 0.8
  if (state === 'mastered') return 0.6
  return 0.35
}

function getAccentColor(world: World): string {
  if (world.state === 'locked') return '#374151'
  return world.accent
}

export function WorldObject({ world, isHovered, isFocused, onHover, onUnhover, onFocus }: WorldObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)

  const accentColor = getAccentColor(world)
  const emissiveIntensity = getEmissiveIntensity(world.state, isHovered, isFocused)

  const isGauntlet = world.id === 'the-gauntlet'
  const isInteractive = world.state !== 'locked' || isGauntlet === false

  const geometry = useMemo(() => {
    if (isGauntlet) return new THREE.OctahedronGeometry(0.7, 0)
    if (world.id === 'intersection-protocol') return new THREE.TetrahedronGeometry(0.65, 1)
    if (world.id === 'parameter-control') return new THREE.BoxGeometry(0.9, 0.9, 0.9)
    if (world.id === 'geometry-sector') return new THREE.TorusGeometry(0.55, 0.18, 12, 40)
    return new THREE.SphereGeometry(0.65, 24, 24)
  }, [world.id, isGauntlet])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const speed = world.state === 'locked' ? 0.003 : isHovered || isFocused ? 0.015 : 0.006
    meshRef.current.rotation.y += delta * speed * 60
    meshRef.current.rotation.x += delta * speed * 20

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (world.state === 'mastered' ? 0.012 : 0.005) * 60
    }
    if (outerRingRef.current && world.state === 'mastered') {
      outerRingRef.current.rotation.z -= delta * 0.008 * 60
    }

    const floatY = Math.sin(Date.now() * 0.001 + world.position[0]) * 0.08
    meshRef.current.position.y = floatY
  })

  const handleClick = () => {
    if (world.state === 'locked') return
    onFocus(world.id)
  }

  return (
    <group position={world.position}>
      {/* Main world object */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(world.id) }}
        onPointerLeave={() => onUnhover()}
        castShadow
      >
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={emissiveIntensity}
          roughness={world.state === 'locked' ? 0.9 : 0.3}
          metalness={world.state === 'locked' ? 0.1 : 0.7}
          wireframe={world.id === 'intersection-protocol' && world.state !== 'locked'}
        />
      </mesh>

      {/* Primary ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, world.state === 'locked' ? 0.01 : 0.025, 8, 64]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={world.state === 'locked' ? 0 : isFocused ? 2 : isHovered ? 1.4 : 0.8}
          transparent
          opacity={world.state === 'locked' ? 0.15 : 0.9}
        />
      </mesh>

      {/* Mastered: second outer ring */}
      {world.state === 'mastered' && (
        <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0.3, 0]}>
          <torusGeometry args={[1.45, 0.018, 8, 64]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Gauntlet gate cross */}
      {isGauntlet && world.state === 'locked' && (
        <>
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[0.08, 0.8, 0.08]} />
            <meshStandardMaterial color="#4B5563" emissive="#374151" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[0.4, 0.08, 0.08]} />
            <meshStandardMaterial color="#4B5563" emissive="#374151" emissiveIntensity={0.3} />
          </mesh>
        </>
      )}

      {/* Hover highlight point light */}
      {(isHovered || isFocused) && world.state !== 'locked' && (
        <pointLight
          color={accentColor}
          intensity={isFocused ? 4 : 2}
          distance={6}
          decay={2}
        />
      )}
    </group>
  )
}
