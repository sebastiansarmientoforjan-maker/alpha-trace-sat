import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { TraceScene } from './scene/TraceScene'
import { HUD } from './hud/HUD'
import { useCameraState } from './hooks/useCameraState'
import { WORLDS } from './data/worlds'
import type { WorldId } from './types/world'

function WorldEntryPlaceholder({ worldId, onReturn }: { worldId: WorldId; onReturn: () => void }) {
  const world = WORLDS.find((w) => w.id === worldId)
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#0e0f11', zIndex: 20, animation: 'fadeIn 0.3s ease-out' }}
    >
      <span
        className="text-[10px] font-mono tracking-[0.4em] mb-3"
        style={{ color: world?.accent ?? '#0D9488' }}
      >
        ENTERING
      </span>
      <h1 className="text-2xl font-mono font-bold text-gray-100 tracking-wider mb-2">
        {world?.name}
      </h1>
      <p className="text-xs font-mono text-gray-600 mb-8">{world?.subtitle}</p>
      <div
        className="h-px w-24 mb-8"
        style={{ backgroundColor: world?.accent ?? '#0D9488', opacity: 0.4 }}
      />
      <p className="text-xs font-mono text-gray-700 mb-8">Chapter content coming in Sprint 2.</p>
      <button
        className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors"
        onClick={onReturn}
      >
        ← RETURN TO ATLAS
      </button>
    </div>
  )
}

export default function App() {
  const { cameraState, hoverWorld, unhoverWorld, focusWorld, returnToIdle, enterWorld } = useCameraState()
  const [enteredWorldId, setEnteredWorldId] = useState<WorldId | null>(null)

  const handleEnterWorld = (id: WorldId) => {
    enterWorld(id)
    setEnteredWorldId(id)
  }

  const handleReturn = () => {
    returnToIdle()
    setEnteredWorldId(null)
  }

  return (
    <div className="relative w-full h-full bg-[#0e0f11]">
      {/* 3D Canvas */}
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

      {/* 2D HUD overlay */}
      {!enteredWorldId && (
        <HUD
          cameraState={cameraState}
          worlds={WORLDS}
          onEnterWorld={handleEnterWorld}
          onReturn={handleReturn}
        />
      )}

      {/* Mission entry placeholder — Sprint 2 will replace this */}
      {enteredWorldId && (
        <WorldEntryPlaceholder worldId={enteredWorldId} onReturn={handleReturn} />
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
