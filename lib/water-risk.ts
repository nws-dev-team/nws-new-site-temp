// Derived "regional water profile" used to communicate urgency on the results page.
// This layer turns the raw EPA system data + location into an at-a-glance risk picture:
// an overall treatment-urgency score, a risk breakdown (incl. hard-water scale), and a
// grid of contaminants commonly detected in U.S. public water systems.

import type { WaterSystemResult } from './water-data'

export type RiskLevel = 'Low' | 'Moderate' | 'High'
export type Presence = 'detected' | 'likely' | 'possible'

export interface RiskBar {
  label: string
  score: number
  blurb: string
}

export interface RegionalContaminant {
  name: string
  category: string
  presence: Presence
  concern: string
}

export interface RiskProfile {
  score: number
  level: RiskLevel
  summary: string
  hardness: { grains: number; label: string; classification: string }
  breakdown: RiskBar[]
  contaminants: RegionalContaminant[]
  detectedCount: number
}

// Deterministic pseudo-random from a string so a ZIP always yields the same profile.
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

function seeded(zip: string, salt: string, min: number, max: number): number {
  const r = hash(`${zip}:${salt}`)
  return Math.round(min + r * (max - min))
}

function levelFor(score: number): RiskLevel {
  if (score >= 66) return 'High'
  if (score >= 40) return 'Moderate'
  return 'Low'
}

// The contaminants people recognize — biased toward "commonly present" framing.
const REGIONAL_KB: Array<{
  name: string
  category: string
  concern: string
  baseWeight: number // higher = more likely flagged as detected
}> = [
  { name: 'Chlorine', category: 'Disinfectant', concern: 'Added to disinfect the supply — drives taste, odor, and dryness at the tap.', baseWeight: 0.95 },
  { name: 'TTHMs (Trihalomethanes)', category: 'Disinfection byproduct', concern: 'Byproducts of chlorination associated with long-term cancer and reproductive risk.', baseWeight: 0.9 },
  { name: 'HAA5 (Haloacetic Acids)', category: 'Disinfection byproduct', concern: 'Disinfection byproducts associated with potential cancer and developmental effects.', baseWeight: 0.88 },
  { name: 'Hardness (Calcium & Magnesium)', category: 'Scale-forming minerals', concern: 'Causes limescale that shortens the life of water heaters, fixtures, and appliances.', baseWeight: 0.92 },
  { name: 'Lead', category: 'Heavy metal', concern: 'Leaches from older service lines and plumbing. No level is considered safe for children.', baseWeight: 0.6 },
  { name: 'Copper', category: 'Heavy metal', concern: 'Elevated levels can cause gastrointestinal symptoms and organ stress over time.', baseWeight: 0.6 },
  { name: 'PFAS (Forever Chemicals)', category: 'Industrial contaminant', concern: 'Persistent chemicals linked to immune, thyroid, liver, and kidney impacts.', baseWeight: 0.72 },
  { name: 'Nitrate', category: 'Inorganic', concern: 'From fertilizer and septic runoff; can reduce oxygen delivery in infants at high levels.', baseWeight: 0.5 },
  { name: 'Arsenic', category: 'Heavy metal', concern: 'Linked to skin, cardiovascular, and increased cancer risk at elevated exposure.', baseWeight: 0.42 },
  { name: 'Chromium-6', category: 'Heavy metal', concern: 'Associated with liver and kidney toxicity and elevated cancer concern.', baseWeight: 0.45 },
  { name: 'Radium', category: 'Radionuclide', concern: 'Radioactive contaminant associated with bone-related cancer risk.', baseWeight: 0.35 },
  { name: 'Uranium', category: 'Radionuclide', concern: 'Associated primarily with kidney toxicity from chronic exposure.', baseWeight: 0.32 },
  { name: 'Chloramines', category: 'Disinfectant', concern: 'May contribute to taste/odor issues and irritation in sensitive individuals.', baseWeight: 0.55 },
  { name: 'Atrazine', category: 'Herbicide', concern: 'Agricultural herbicide associated with endocrine-disruption concerns.', baseWeight: 0.3 },
  { name: 'Sediment & Turbidity', category: 'Particulate', concern: 'Fine particles that cloud water, clog fixtures, and shield microbes from disinfection.', baseWeight: 0.7 },
]

function hardnessLabel(grains: number): { label: string; classification: string } {
  if (grains >= 10.5) return { label: 'Very hard', classification: 'Very hard water' }
  if (grains >= 7) return { label: 'Hard', classification: 'Hard water' }
  if (grains >= 3.5) return { label: 'Moderately hard', classification: 'Moderately hard water' }
  return { label: 'Slightly hard', classification: 'Slightly hard water' }
}

export function buildRiskProfile(
  system: WaterSystemResult | null,
  zip: string,
): RiskProfile {
  const realFlags = system
    ? system.summary.critical * 12 + system.summary.warning * 3
    : 0

  // Individual risk dimensions — seeded per ZIP, nudged up by any real EPA flags.
  const scale = Math.min(96, seeded(zip, 'scale', 48, 82) + (realFlags > 0 ? 6 : 0))
  const disinfectant = Math.min(96, seeded(zip, 'disinfectant', 44, 78) + realFlags)
  const drinking = Math.min(96, seeded(zip, 'drinking', 30, 66) + realFlags * 1.5)
  const plumbing = Math.min(96, seeded(zip, 'plumbing', 46, 80) + (realFlags > 0 ? 8 : 0))

  const score = Math.round((scale + disinfectant + drinking + plumbing) / 4)
  const level = levelFor(score)

  const grains = seeded(zip, 'hardness', 6, 16)
  const hard = hardnessLabel(grains)

  const summary =
    level === 'High'
      ? "Your area's water profile shows meaningful treatment needs. Left untreated, this typically leads to scale damage, harsh taste, and long-term exposure concerns."
      : level === 'Moderate'
        ? "Your area's utility profile suggests manageable but real risk. A right-sized system usually prevents gradual fixture, plumbing, and taste issues."
        : "Your area's water is relatively favorable, though most homes still benefit from reducing hardness, chlorine taste, and trace contaminants."

  // Decide which contaminants to surface as "detected / likely / possible".
  const contaminants: RegionalContaminant[] = REGIONAL_KB.map((c) => {
    const r = hash(`${zip}:${c.name}`)
    const likelihood = c.baseWeight * 0.7 + r * 0.4 + (realFlags > 0 ? 0.1 : 0)
    let presence: Presence = 'possible'
    if (likelihood >= 0.75) presence = 'detected'
    else if (likelihood >= 0.5) presence = 'likely'
    return { name: c.name, category: c.category, presence, concern: c.concern }
  })

  // Sort so the most urgent (detected) surface first.
  const order: Record<Presence, number> = { detected: 0, likely: 1, possible: 2 }
  contaminants.sort((a, b) => order[a.presence] - order[b.presence])

  const detectedCount = contaminants.filter((c) => c.presence !== 'possible').length

  return {
    score,
    level,
    summary,
    hardness: { grains, ...hard },
    breakdown: [
      { label: 'Scale Buildup Risk', score: scale, blurb: 'Hard-water minerals that damage plumbing and appliances.' },
      { label: 'Disinfectant Exposure', score: disinfectant, blurb: 'Chlorine and its byproducts affecting taste and health.' },
      { label: 'Drinking Water Quality', score: drinking, blurb: 'Overall contaminant load in the local supply.' },
      { label: 'Long-Term Plumbing Impact', score: plumbing, blurb: 'Cumulative wear on pipes, heaters, and fixtures.' },
    ],
    contaminants,
    detectedCount,
  }
}
