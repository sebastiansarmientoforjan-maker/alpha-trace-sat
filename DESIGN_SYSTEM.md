# ALPHA TRACE — Design System

## 1. Core Design Thesis

Alpha Trace is not a dashboard. It is not a game. It is a **precision instrument for mathematical mastery**.

The student fantasy: *I am not a student doing homework. I am an operator navigating a system that requires skill to enter and skill to master.*

The product must feel like something you open because it's worth opening — because it looks sharp, has genuine identity, and rewards presence.

**The central shift:** From "see your stats" → to "enter and operate".

**Tone:** Dark. Premium. Tactical. Atmospheric. High-agency.
**Anti-tone:** Childish. Mascot-driven. Bright SaaS. Cringe gamification. Generic ed-tech.

How this avoids cringe gamification: rewards are earned through mathematical correctness, not through clicking. Unlock gates are real — no XP inflation, no false progress. The visual language treats the student as capable, not cute.

---

## 2. World System (4 Worlds + The Gauntlet)

### World 1 — INTERSECTION PROTOCOL
- **Math domain:** Systems of equations, graph intersections, inequality boundaries, overlap logic
- **Visual metaphor:** Tactical targeting. Two planes converging. The moment lines meet is the moment power transfers.
- **Geometry language:** Intersecting planes, axis cuts, angular grid fields, interference patterns
- **Accent:** Emerald / teal-green `#10B981`
- **Emotional tone:** Tactical, precise, sharp
- **Position in scene:** Far left / northwest

### World 2 — REGRESSION CORE *(Sprint 1: fully explorable)*
- **Math domain:** Linear/exponential/quadratic regression, scatter plots, curve fitting, residuals
- **Visual metaphor:** A signal-processing core. Data points orbit a fitted curve like a gravitational field.
- **Geometry language:** Point clouds, orbital arcs, statistical constellations, fitted curve as spine
- **Accent:** Teal `#0D9488`
- **Emotional tone:** Analytic, elegant, slightly cosmic
- **Position in scene:** Near right / east-center

### World 3 — PARAMETER CONTROL
- **Math domain:** Sliders, parameter shifts, dynamic graph behavior, variable modulation
- **Visual metaphor:** A tuning station. The world itself responds to the student's adjustments.
- **Geometry language:** Parallel rails, sliding bands, responsive structural frames, parametric deformation
- **Accent:** Blue `#3B82F6`
- **Emotional tone:** Engineered, fluid, reactive
- **Position in scene:** Far right / northeast

### World 4 — GEOMETRY SECTOR
- **Math domain:** Circle geometry, trig visuals, shape reasoning, angle/arc relationships
- **Visual metaphor:** A ceremonial chamber. Rings, arcs, radial constructions — a place of exact form.
- **Geometry language:** Rings, sectors, radial lattices, geometric frames, concentric symmetry
- **Accent:** Cool silver-violet `#8B5CF6`
- **Emotional tone:** Ceremonial, crystalline, exact
- **Position in scene:** South / below center

### 5 — THE GAUNTLET *(locked until 4 worlds sufficiently completed)*
- **Math domain:** Synthesis — all four domains under time pressure
- **Visual metaphor:** A sealed vault. Converging pathways from all four worlds point here. The gate is visible from the start but inaccessible.
- **Geometry language:** Central monolith, converging rails from each world, sealed gate with visible lock mechanism
- **Accent:** Platinum / white / restrained gold `#E5E7EB` → `#F59E0B` (activated only when unlocked)
- **Emotional tone:** Final, prestigious, severe
- **Position in scene:** Center / above

---

## 3. Color & Accent Logic

| World | Accent HEX | Usage |
|---|---|---|
| Intersection Protocol | `#10B981` | Active ring glow, HUD label, bloom |
| Regression Core | `#0D9488` | Active ring glow, HUD label, bloom |
| Parameter Control | `#3B82F6` | Active ring glow, HUD label, bloom |
| Geometry Sector | `#8B5CF6` | Active ring glow, HUD label, bloom |
| The Gauntlet (locked) | `#6B7280` | Desaturated, heavy fog |
| The Gauntlet (unlocked) | `#F59E0B` | Bloom at full intensity |

**Background:** `#0E0F11` (near-black, scene fog color)
**Typography:** Inter (UI) + DM Mono (data/code values)
**Surface:** `#13151A` (cards, overlays)
**Muted text:** `#6B7280`

---

## 4. World States

### locked
- World object: desaturated, fog-occluded, low emission
- Ring: no glow, color `#374151` (dark grey)
- HUD: shows padlock icon, mastery requirement ("Complete 2 chapters in any world")
- Bloom: none

### active (in progress)
- World object: full color, slight float animation
- Ring: pulsing glow at world accent color
- Bloom: moderate, `luminanceThreshold: 0.35`
- HUD: shows chapter progress, last chapter attempted

### mastered
- World object: color + steady emission + subtle ring rotation
- Ring: steady double-ring glow
- Bloom: full at accent color
- HUD: shows mastery badge, chapter completion, Gauntlet contribution

---

## 5. Camera States

All camera positions are **fixed** — no free roam. Transitions use THREE.Vector3.lerp at ~1.2s ease-in-out.

| State | Camera Position | FOV | Notes |
|---|---|---|---|
| `idle` | Overview, slightly above center | 60° | All 5 world objects visible |
| `hover:world` | Pull 20% toward hovered world | 58° | Subtle anticipation |
| `focus:world` | Close orbit of selected world | 45° | World fills ~60% of frame |
| `enter:world` | Transition to 2D Mission UI | — | Canvas fades, 2D screen slides in |
| `return` | Reverse of focus → idle | 60° | 1.2s lerp back to overview |

The Gauntlet camera: if unlocked, triggers a dramatic slow pull to center with bloom flare.

---

## 6. HUD Overlay Rules

The HUD is HTML positioned **above** the R3F canvas via CSS `position: absolute`. It is not inside the 3D scene.

### Always visible
- Top-left: `ALPHA TRACE` wordmark + current world system status
- Top-right: student name + SAT exam countdown (days)

### Contextual (appears on world focus)
- Bottom-left: world name + chapter progress bar
- Bottom-right: primary CTA button ("Enter World" / "Continue" / "Locked")
- Center-bottom: brief world description (1 sentence)

### Silent (never shown proactively)
- Detailed stats, leaderboards, XP numbers, streaks

### Animation rules
- HUD elements fade in at 200ms, fade out at 150ms
- CTA button slides up from bottom on world focus
- Countdown number does not animate (static — avoids anxiety)

---

## 7. 3D vs 2D Boundary

| Belongs in 3D | Belongs in 2D |
|---|---|
| World spheres / objects | All chapter content |
| Camera choreography | Practice problems |
| Atmospheric fog/bloom | Desmos integration |
| World state visuals | Trace Log / Arsenal |
| Navigation transitions | Boss Battle UI |
| Locked/unlocked gate | Loadout screen |
| | HUD overlay |

**Rule:** If the user needs to read, click a precise target, or interact with math — it's 2D. The 3D layer is purely navigation and atmosphere.

---

## 8. Sprint 1 Scope

### In scope
- [ ] Vite + React + TypeScript + Tailwind setup
- [ ] React Three Fiber scene with all 5 world objects placed
- [ ] Regression Core: fully interactive (click → camera focuses → HUD shows content CTA)
- [ ] Camera state system: idle → hover → focus → return
- [ ] HUD overlay: wordmark, countdown placeholder, world info on focus
- [ ] World states: locked/active/mastered visually differentiated
- [ ] The Gauntlet: visible but locked with visible gate geometry
- [ ] Bloom + fog postprocessing
- [ ] Basic world click → route to 2D placeholder page

### Intentionally deferred (Sprint 2+)
- Chapter/practice screen content
- Desmos integration
- Boss Battle
- Loadout screen
- Trace Log / Arsenal
- Firebase auth + real data
- Mobile / fallback 2D map
- Sound design
- The Gauntlet actual content

---

## 9. Anti-Patterns (What We Are NOT Building)

- No dashboard home with KPI cards
- No linear node map as primary navigation
- No "Atlas Map" that's just a row of nodes
- No progress circles as the main visual motif
- No mascots, characters, or avatar systems
- No visible XP numbers or streak counters in the main scene
- No Dribbble blobs or gradient-heavy SaaS aesthetic
- No overdecorated cyberpunk (neon grids, matrix rain)
- No shallow gamification (participation badges, confetti for anything)
- No multiple 3D canvases
- No UI panels embedded inside the 3D scene
- No free roam camera
- No physics simulation
- No external 3D asset files (GLB/GLTF) for world objects — primitives + lighting only
