import { useMemo } from 'react'
import type { CameraState, WorldId } from '../types/world'
import type { World } from '../types/world'

interface HUDProps {
  cameraState: CameraState
  worlds: World[]
  onEnterWorld: (id: WorldId) => void
  onReturn: () => void
}

function MasteryBar({ completed, total, accent }: { completed: number; total: number; accent: string }) {
  const pct = total > 0 ? (completed / total) * 100 : 0
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1 font-mono">
        <span>{completed}/{total} chapters</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-0.5 bg-gray-800 w-full rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  )
}

export function HUD({ cameraState, worlds, onEnterWorld, onReturn }: HUDProps) {
  const focusedWorld = useMemo(() => {
    if (cameraState.type !== 'focus') return null
    return worlds.find(
      (w) => w.id === (cameraState as { type: 'focus'; worldId: WorldId }).worldId
    ) ?? null
  }, [cameraState, worlds])

  const daysToExam = 18

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 10 }}>

      {/* Top-left — Identity */}
      <div className="absolute top-6 left-7 flex flex-col gap-0.5">
        <span className="text-xs font-mono tracking-[0.3em] text-gray-500">ALPHA</span>
        <span
          className="text-lg font-mono font-bold tracking-[0.2em]"
          style={{ color: '#0D9488' }}
        >
          TRACE
        </span>
        <span className="text-[10px] font-mono text-gray-600 tracking-widest mt-0.5">SAT MATH SYSTEM</span>
      </div>

      {/* Top-right — Status */}
      <div className="absolute top-6 right-7 text-right flex flex-col gap-1">
        <span className="text-xs font-mono text-gray-500">STUDENT</span>
        <span className="text-sm font-mono text-gray-300">Alpha Operator</span>
        <div className="flex items-center justify-end gap-2 mt-1">
          <span className="text-[10px] font-mono text-gray-600">EXAM IN</span>
          <span className="text-xs font-mono font-bold" style={{ color: '#0D9488' }}>
            {daysToExam}D
          </span>
        </div>
      </div>

      {/* World focus panel — bottom */}
      {focusedWorld && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
          style={{ animation: 'slideUp 0.25s ease-out both' }}
        >
          <div
            className="flex flex-col gap-3 min-w-80 max-w-sm"
            style={{
              background: 'rgba(19,21,26,0.92)',
              border: `1px solid ${focusedWorld.accent}33`,
              borderTop: `2px solid ${focusedWorld.accent}`,
              padding: '20px 24px',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* World name */}
            <div>
              <span
                className="text-[10px] font-mono tracking-widest"
                style={{ color: focusedWorld.accent }}
              >
                WORLD {worlds.indexOf(focusedWorld) + 1}
              </span>
              <h2 className="text-base font-mono font-bold text-gray-100 mt-0.5 tracking-wide">
                {focusedWorld.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {focusedWorld.description}
              </p>
            </div>

            {/* Progress */}
            {focusedWorld.state !== 'locked' && (
              <MasteryBar
                completed={focusedWorld.chaptersCompleted}
                total={focusedWorld.chaptersTotal}
                accent={focusedWorld.accent}
              />
            )}

            {/* Locked message */}
            {focusedWorld.state === 'locked' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-600">LOCKED</span>
                <span className="text-[10px] font-mono text-gray-700">·</span>
                <span className="text-[10px] font-mono text-gray-600">
                  Complete active worlds to unlock
                </span>
              </div>
            )}

            {/* CTA row */}
            <div className="flex items-center gap-3 pt-1">
              <button
                className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors"
                onClick={onReturn}
              >
                ← BACK
              </button>
              {focusedWorld.state !== 'locked' && (
                <button
                  className="flex-1 text-xs font-mono font-bold py-2 px-4 transition-all hover:opacity-90"
                  style={{
                    backgroundColor: focusedWorld.accent,
                    color: '#0e0f11',
                  }}
                  onClick={() => onEnterWorld(focusedWorld.id)}
                >
                  {focusedWorld.chaptersCompleted > 0 ? 'CONTINUE MISSION' : 'BEGIN MISSION'} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Idle instruction */}
      {cameraState.type === 'idle' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-mono text-gray-700 tracking-widest">
            SELECT A WORLD TO BEGIN
          </span>
        </div>
      )}
    </div>
  )
}
