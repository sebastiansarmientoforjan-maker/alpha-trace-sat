import { useMemo } from 'react'
import type { CameraState, WorldId, World } from '../types/world'

interface HUDProps {
  cameraState: CameraState
  worlds: World[]
  onEnterWorld: (id: WorldId) => void
  onReturn: () => void
}

function MasteryBar({ completed, total, accent }: { completed: number; total: number; accent: string }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="h-px bg-gray-800 w-full overflow-hidden">
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[10px] font-mono text-gray-600">{completed} of {total} chapters</span>
        <span className="text-[10px] font-mono" style={{ color: accent }}>{pct}%</span>
      </div>
    </div>
  )
}

// World index used as ordinal label: 01 02 03 04
function ordinal(n: number): string {
  return String(n).padStart(2, '0')
}

export function HUD({ cameraState, worlds, onEnterWorld, onReturn }: HUDProps) {
  const focusedWorld = useMemo(() => {
    if (cameraState.type !== 'focus') return null
    return worlds.find(
      (w) => w.id === (cameraState as { type: 'focus'; worldId: WorldId }).worldId
    ) ?? null
  }, [cameraState, worlds])

  const isFocused = cameraState.type === 'focus'
  const daysToExam = 18
  const activeWorlds = worlds.filter(w => w.state !== 'locked' && w.id !== 'the-gauntlet')
  const gauntletUnlockable = activeWorlds.every(w => w.state === 'mastered')

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-8 pt-7">

        {/* Left — Identity */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-mono font-black tracking-[0.25em]"
              style={{ color: '#0D9488' }}
            >
              TRACE
            </span>
            <span className="text-[10px] font-mono text-gray-600 tracking-[0.2em] mb-0.5">
              BY ALPHA
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-700 tracking-[0.3em] mt-0.5">
            SAT MATH SYSTEM
          </span>
        </div>

        {/* Right — Session state */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
            {/* Exam countdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-gray-700 tracking-widest">EXAM</span>
              <span
                className="text-sm font-mono font-bold tabular-nums"
                style={{ color: '#0D9488' }}
              >
                {daysToExam}
              </span>
              <span className="text-[9px] font-mono text-gray-600">DAYS</span>
            </div>
            {/* Separator */}
            <div className="w-px h-3 bg-gray-800" />
            {/* System status */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 4px #10B981' }} />
              <span className="text-[9px] font-mono text-gray-600 tracking-widest">ACTIVE</span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-gray-700">Alpha Operator</span>
        </div>
      </div>

      {/* ── WORLD STATUS STRIP — bottom left, always visible ─────────── */}
      {!isFocused && (
        <div className="absolute bottom-8 left-8 flex flex-col gap-1.5">
          {worlds.filter(w => w.id !== 'the-gauntlet').map((world, i) => (
            <div key={world.id} className="flex items-center gap-2.5">
              <span className="text-[9px] font-mono text-gray-700 w-4">{ordinal(i + 1)}</span>
              <div className="w-12 h-px bg-gray-800 overflow-hidden">
                {world.state !== 'locked' && (
                  <div
                    className="h-full"
                    style={{
                      width: `${world.chaptersTotal > 0 ? (world.chaptersCompleted / world.chaptersTotal) * 100 : 0}%`,
                      backgroundColor: world.accent,
                      transition: 'width 1s ease'
                    }}
                  />
                )}
              </div>
              <span
                className="text-[9px] font-mono tracking-wide"
                style={{ color: world.state === 'locked' ? '#374151' : world.accent }}
              >
                {world.state === 'locked' ? 'LOCKED' : world.name.split(' ')[0]}
              </span>
            </div>
          ))}
          {/* Gauntlet unlock status */}
          <div className="flex items-center gap-2.5 mt-1 pt-1" style={{ borderTop: '1px solid #1F2937' }}>
            <span className="text-[9px] font-mono text-gray-700 w-4">⬡</span>
            <span className="text-[9px] font-mono" style={{ color: gauntletUnlockable ? '#F59E0B' : '#374151' }}>
              {gauntletUnlockable ? 'GAUNTLET UNLOCKED' : 'GAUNTLET LOCKED'}
            </span>
          </div>
        </div>
      )}

      {/* ── IDLE INSTRUCTION ─────────────────────────────────────────── */}
      {cameraState.type === 'idle' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-[9px] font-mono text-gray-800 tracking-[0.4em] uppercase">
            select world
          </span>
        </div>
      )}

      {/* ── FOCUS PANEL — right side ──────────────────────────────────── */}
      {focusedWorld && (
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-auto"
          style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          <div
            className="flex flex-col justify-between h-full max-h-80 w-72"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(14,15,17,0.97))',
              borderLeft: `1px solid ${focusedWorld.accent}22`,
              paddingLeft: '28px',
              paddingRight: '36px',
              paddingTop: '32px',
              paddingBottom: '32px',
            }}
          >
            {/* World identity */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                {/* Accent dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: focusedWorld.state === 'locked' ? '#374151' : focusedWorld.accent,
                    boxShadow: focusedWorld.state !== 'locked' ? `0 0 6px ${focusedWorld.accent}` : 'none'
                  }}
                />
                <span className="text-[9px] font-mono text-gray-600 tracking-[0.3em]">
                  WORLD {ordinal(worlds.indexOf(focusedWorld) + 1)}
                </span>
              </div>

              <h2
                className="text-base font-mono font-bold leading-tight tracking-wide"
                style={{ color: focusedWorld.state === 'locked' ? '#4B5563' : '#F9FAFB' }}
              >
                {focusedWorld.name}
              </h2>
              <p className="text-[10px] font-mono text-gray-600 leading-relaxed mt-1">
                {focusedWorld.subtitle}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px my-4" style={{ backgroundColor: `${focusedWorld.accent}18` }} />

            {/* Description */}
            <p className="text-[11px] text-gray-500 leading-relaxed font-mono flex-1">
              {focusedWorld.description}
            </p>

            {/* Progress */}
            <div className="mt-4">
              {focusedWorld.state !== 'locked' ? (
                <MasteryBar
                  completed={focusedWorld.chaptersCompleted}
                  total={focusedWorld.chaptersTotal}
                  accent={focusedWorld.accent}
                />
              ) : (
                <div className="text-[9px] font-mono text-gray-700 tracking-widest">
                  COMPLETE ACTIVE WORLDS TO UNLOCK
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2 mt-5">
              {focusedWorld.state !== 'locked' && (
                <button
                  className="w-full text-xs font-mono font-bold py-3 px-4 transition-all duration-150 hover:brightness-110 active:scale-[0.98] text-left"
                  style={{
                    backgroundColor: focusedWorld.accent,
                    color: '#0a0b0d',
                    letterSpacing: '0.12em',
                  }}
                  onClick={() => onEnterWorld(focusedWorld.id)}
                >
                  {focusedWorld.chaptersCompleted > 0 ? 'CONTINUE MISSION' : 'BEGIN MISSION'} →
                </button>
              )}
              <button
                className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors text-left py-1"
                onClick={onReturn}
              >
                ← RETURN TO ATLAS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
