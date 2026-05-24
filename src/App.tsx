import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { TraceScene } from './scene/TraceScene'
import { HUD } from './hud/HUD'
import { useCameraState } from './hooks/useCameraState'
import { WORLDS } from './data/worlds'
import type { WorldId } from './types/world'

const WORLD_MISSION_FRAMING: Record<string, string> = {
  'intersection-protocol': 'Master the logic of convergence. Every intersection is a constraint made visible — a boundary that defines both what is true and what is not.',
  'regression-core': 'Extract signal from scatter. The pattern exists before you find it. Your task is to make the invisible curve legible.',
  'parameter-control': 'Learn to tune systems under pressure. A variable is not a number — it is a dimension of control.',
  'geometry-sector': 'Navigate spatial form with precision. Circle, arc, and angle are not abstractions — they are the grammar of space.',
  'the-gauntlet': 'All domains converge here. There is no partial credit in synthesis.',
}

function WorldEntryGate({ worldId, onReturn, onBegin }: {
  worldId: WorldId
  onReturn: () => void
  onBegin: () => void
}) {
  const world = WORLDS.find((w) => w.id === worldId)
  if (!world) return null
  const framing = WORLD_MISSION_FRAMING[worldId] ?? ''

  return (
    <div
      className="absolute inset-0 flex"
      style={{ background: '#09090b', zIndex: 20, animation: 'gateReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}
    >
      {/* Left — accent column */}
      <div
        className="w-1 h-full flex-shrink-0"
        style={{ backgroundColor: world.accent, opacity: 0.6 }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between px-16 py-14">

        {/* Top — breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            className="text-[9px] font-mono text-gray-700 hover:text-gray-500 transition-colors tracking-widest"
            onClick={onReturn}
          >
            ← ATLAS
          </button>
          <span className="text-gray-800 text-[9px]">/</span>
          <span className="text-[9px] font-mono tracking-widest" style={{ color: world.accent }}>
            {world.id.toUpperCase().replace(/-/g, ' ')}
          </span>
        </div>

        {/* Center — world identity */}
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="flex flex-col gap-2">
            <span
              className="text-[9px] font-mono tracking-[0.4em]"
              style={{ color: world.accent }}
            >
              SECTOR BRIEFING
            </span>
            <h1
              className="text-4xl font-mono font-black tracking-tight leading-none"
              style={{ color: '#F9FAFB' }}
            >
              {world.name}
            </h1>
            <p className="text-sm font-mono tracking-widest mt-1" style={{ color: world.accent, opacity: 0.7 }}>
              {world.subtitle}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-16" style={{ backgroundColor: world.accent, opacity: 0.3 }} />

          {/* Mission framing */}
          <p className="text-[13px] font-mono text-gray-500 leading-relaxed max-w-md">
            {framing}
          </p>

          {/* Progress state */}
          <div className="flex items-center gap-3">
            {world.chaptersCompleted > 0 ? (
              <>
                <div className="h-px w-8" style={{ backgroundColor: world.accent }} />
                <span className="text-[10px] font-mono text-gray-600">
                  {world.chaptersCompleted} of {world.chaptersTotal} chapters completed
                </span>
              </>
            ) : (
              <>
                <div className="h-px w-8 bg-gray-800" />
                <span className="text-[10px] font-mono text-gray-700">
                  No progress recorded — first entry
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom — actions */}
        <div className="flex items-center gap-6">
          <button
            className="text-sm font-mono font-bold py-3 px-8 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: world.accent,
              color: '#09090b',
              letterSpacing: '0.15em',
            }}
            onClick={onBegin}
          >
            {world.chaptersCompleted > 0 ? 'RESUME MISSION' : 'INITIATE MISSION'} →
          </button>
          <button
            className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors tracking-widest"
            onClick={onReturn}
          >
            ← RETURN TO ATLAS
          </button>
        </div>
      </div>

      {/* Right — world index / metadata column */}
      <div className="w-56 flex-shrink-0 flex flex-col justify-center px-8 gap-6"
        style={{ borderLeft: '1px solid #1a1a1a' }}>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-gray-700 tracking-widest">SECTOR</span>
          <span className="text-2xl font-mono font-black text-gray-800">
            {String(WORLDS.indexOf(world) + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="h-px bg-gray-900" />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-gray-700 tracking-widest">CHAPTERS</span>
          <span className="text-lg font-mono font-bold text-gray-700">{world.chaptersTotal}</span>
        </div>
        <div className="h-px bg-gray-900" />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono text-gray-700 tracking-widest">STATUS</span>
          <span
            className="text-[10px] font-mono font-bold tracking-widest"
            style={{ color: world.state === 'mastered' ? world.accent : world.state === 'active' ? world.accent : '#374151' }}
          >
            {world.state.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { cameraState, hoverWorld, unhoverWorld, focusWorld, returnToIdle, enterWorld } = useCameraState()
  // 'gate' = world entry briefing screen, 'mission' = active chapter content (Sprint 2)
  const [screen, setScreen] = useState<{ type: 'atlas' } | { type: 'gate'; worldId: WorldId } | { type: 'mission'; worldId: WorldId }>({ type: 'atlas' })

  const handleEnterWorld = (id: WorldId) => {
    enterWorld(id)
    setScreen({ type: 'gate', worldId: id })
  }

  const handleBeginMission = (id: WorldId) => {
    setScreen({ type: 'mission', worldId: id })
  }

  const handleReturn = () => {
    returnToIdle()
    setScreen({ type: 'atlas' })
  }

  return (
    <div className="relative w-full h-full bg-[#09090b]">
      {/* 3D Canvas — always rendered, dims behind gate/mission screens */}
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <TraceScene
          worlds={WORLDS}
          cameraState={cameraState}
          onHoverWorld={hoverWorld}
          onUnhoverWorld={unhoverWorld}
          onFocusWorld={focusWorld}
        />
      </Canvas>

      {/* 2D HUD — only on atlas */}
      {screen.type === 'atlas' && (
        <HUD
          cameraState={cameraState}
          worlds={WORLDS}
          onEnterWorld={handleEnterWorld}
          onReturn={handleReturn}
        />
      )}

      {/* World entry gate screen */}
      {screen.type === 'gate' && (
        <WorldEntryGate
          worldId={screen.worldId}
          onReturn={handleReturn}
          onBegin={() => handleBeginMission(screen.worldId)}
        />
      )}

      {/* Mission screen — Sprint 2 content goes here */}
      {screen.type === 'mission' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: '#09090b', zIndex: 20 }}
        >
          <span className="text-[9px] font-mono text-gray-700 tracking-[0.4em] mb-8">CHAPTER CONTENT</span>
          <p className="text-xs font-mono text-gray-700 mb-8">Sprint 2</p>
          <button
            className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors tracking-widest"
            onClick={handleReturn}
          >
            ← RETURN TO ATLAS
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes gateReveal {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
