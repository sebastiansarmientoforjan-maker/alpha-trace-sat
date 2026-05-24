import type { World } from '../types/world'

// ─── REFINEMENT PASS · STEP 01 ───────────────────────────────────────────────
// Two changes vs. previous:
//
//  1. REGRESSION CORE accent shifts from teal (#0D9488) to cyan (#22D3EE).
//     Teal-on-emerald is unreadable next to Intersection Protocol — the student
//     cannot color-code two adjacent worlds when both sit in the same hue band.
//     Cyan is analytic, cold, and visually distinct from Intersection's emerald.
//
//  2. Positions reseated on a constellation around the Gauntlet (not the origin).
//     Worlds sit ~6 units from the Gauntlet in roughly equal radial distance.
//     Gauntlet pulled forward (Z: -7 → -6.5) and slightly down (Y: 2.5 → 1.4)
//     so it occupies the upper-third center of the camera frame from idle.
//
//     Per-world quadrant placement preserves the original design system intent:
//       - Intersection : NW (upper-left)
//       - Parameter    : NE (upper-right)
//       - Regression   : E  (middle-right, slightly forward to read "near")
//       - Geometry     : S  (bottom, slightly off-axis to break symmetry)
//       - Gauntlet     : center · upper-third · deep
//
// Nothing else changes — state, chapters, copy, ids all preserved.

export const WORLDS: World[] = [
  {
    id: 'intersection-protocol',
    name: 'INTERSECTION PROTOCOL',
    subtitle: 'Systems · Boundaries · Convergence',
    accent: '#10B981',
    position: [-4.4, 1.2, -2.5],  // was [-5.5, 0.5, 0.5]
    state: 'active',
    chaptersTotal: 6,
    chaptersCompleted: 2,
    description: 'Systems of equations, graph intersections, inequality boundaries.',
  },
  {
    id: 'regression-core',
    name: 'REGRESSION CORE',
    subtitle: 'Signals · Curve Fitting · Data Gravity',
    accent: '#22D3EE',             // CYAN — was #0D9488 (teal). Read note above.
    position: [4.4, -1.0, -1.5],  // was [4.5, -0.5, 1] — pulled back, lowered
    state: 'active',
    chaptersTotal: 6,
    chaptersCompleted: 1,
    description: 'Linear, exponential, and quadratic regression. Pattern extraction from scatter fields.',
  },
  {
    id: 'parameter-control',
    name: 'PARAMETER CONTROL',
    subtitle: 'Modulation · Sliders · Dynamic Systems',
    accent: '#3B82F6',
    position: [4.4, 1.2, -2.5],   // was [5, 2, -2] — squared up with Intersection
    state: 'locked',
    chaptersTotal: 5,
    chaptersCompleted: 0,
    description: 'Slider-driven graph behavior. Variable modulation and parametric deformation.',
  },
  {
    id: 'geometry-sector',
    name: 'GEOMETRY SECTOR',
    subtitle: 'Circles · Arcs · Spatial Form',
    accent: '#8B5CF6',
    position: [-1.2, -3.2, -2.0], // was [0, -3.5, 3] — pulled deeper, off-axis
    state: 'locked',
    chaptersTotal: 6,
    chaptersCompleted: 0,
    description: 'Circle geometry, trig visuals, angle and arc relationships.',
  },
  {
    id: 'the-gauntlet',
    name: 'THE GAUNTLET',
    subtitle: 'Synthesis · Mastery · Pressure',
    accent: '#F59E0B',
    position: [0, 1.4, -6.5],     // was [0, 2.5, -7] — upper-third center, slightly forward
    state: 'locked',
    chaptersTotal: 1,
    chaptersCompleted: 0,
    description: 'All four domains converge. Locked until sufficient mastery is achieved.',
  },
]
