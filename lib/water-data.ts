// Knowledge base + parsing helpers for EPA SDWA (Safe Drinking Water Act) data
// Data source: EPA ECHO SDW REST services (echodata.epa.gov)

export type Severity = 'critical' | 'warning' | 'clear'

export type ContaminantCategory =
  | 'inorganic'
  | 'organic'
  | 'disinfection-byproduct'
  | 'disinfectant'
  | 'microbial'
  | 'radionuclide'
  | 'lead-copper'
  | 'treatment'
  | 'monitoring'
  | 'other'

export interface ContaminantInfo {
  category: ContaminantCategory
  /** Whether this is a health-based contaminant (vs. an administrative/monitoring rule) */
  healthBased: boolean
  /** Plain-language description of what it is */
  about: string
  /** Plain-language health concern */
  concern: string
}

export interface ParsedContaminant {
  code: string
  name: string
  category: ContaminantCategory
  severity: Severity
  /** 'current' = active violation, 'past' = violated within 3 years (resolved), 'monitored' = on record, compliant */
  status: 'current' | 'past' | 'monitored'
  healthBased: boolean
  about: string
  concern: string
}

export interface WaterSystemResult {
  pwsId: string
  name: string
  populationServed: number
  source: string
  ownerType: string
  citiesServed: string
  countiesServed: string
  reportUrl: string | null
  healthFlag: boolean
  seriousViolator: boolean
  leadCopperExceedance: boolean
  violationCategories: string[]
  contaminants: ParsedContaminant[]
  summary: { critical: number; warning: number; clear: number }
  overallSeverity: Severity
}

export interface WaterReport {
  location: { city: string; state: string; zip: string }
  featured: WaterSystemResult | null
  others: WaterSystemResult[]
  totalSystems: number
}

// Category-level fallback metadata, used when a specific code isn't in the KB.
const CATEGORY_META: Record<
  ContaminantCategory,
  { healthBased: boolean; about: string; concern: string }
> = {
  inorganic: {
    healthBased: true,
    about: 'An inorganic chemical or heavy metal that can dissolve into water from rock, soil, plumbing, or industrial runoff.',
    concern: 'Long-term exposure above EPA limits is linked to serious health effects. Certified filtration can significantly reduce it.',
  },
  organic: {
    healthBased: true,
    about: 'A synthetic organic chemical such as a pesticide, herbicide, or industrial solvent.',
    concern: 'Many of these are linked to cancer or organ damage with long-term exposure. Activated carbon and RO filtration reduce most.',
  },
  'disinfection-byproduct': {
    healthBased: true,
    about: 'A byproduct formed when chlorine reacts with natural organic matter in the water.',
    concern: 'Long-term exposure is associated with elevated cancer risk. Carbon and reverse-osmosis filtration reduce these.',
  },
  disinfectant: {
    healthBased: true,
    about: 'A disinfectant such as chlorine or chloramine added to kill bacteria in the supply.',
    concern: 'Necessary for safety, but high residual levels affect taste, odor, and can irritate skin. Easily reduced with carbon filtration.',
  },
  microbial: {
    healthBased: true,
    about: 'A microbial contaminant or bacterial indicator such as E. coli or total coliform.',
    concern: 'Can indicate the presence of disease-causing organisms and may cause immediate gastrointestinal illness. This is an acute, urgent concern.',
  },
  radionuclide: {
    healthBased: true,
    about: 'A radioactive element such as radium, uranium, or gross alpha particles, usually from natural geology.',
    concern: 'Long-term exposure increases cancer risk and can harm the kidneys. Reverse-osmosis filtration is highly effective.',
  },
  'lead-copper': {
    healthBased: true,
    about: 'Lead and/or copper, which typically leach into water from older service lines, pipes, and fixtures.',
    concern: 'There is no safe level of lead, especially for children and pregnant women. Certified lead-reduction filtration is strongly recommended.',
  },
  treatment: {
    healthBased: true,
    about: 'A treatment-technique rule that requires the utility to properly filter or disinfect the water.',
    concern: 'A violation means required treatment steps were not fully met, which can raise the risk of contamination.',
  },
  monitoring: {
    healthBased: false,
    about: 'A monitoring or record-keeping requirement, such as the Total Coliform Rule sampling schedule.',
    concern: 'A violation here means required testing or paperwork was missed. It does not necessarily mean the water is unsafe, but it reduces transparency.',
  },
  other: {
    healthBased: false,
    about: 'An administrative requirement such as public notification or consumer reporting.',
    concern: 'A violation means the utility missed a required notice or report. This is a transparency issue rather than a direct health risk.',
  },
}

// Specific well-known contaminant codes.
const CONTAMINANT_KB: Record<string, ContaminantInfo> = {
  '1005': { category: 'inorganic', healthBased: true, about: 'Arsenic, a naturally occurring and industrial heavy metal.', concern: 'A known human carcinogen. Long-term exposure is linked to cancer, skin damage, and cardiovascular disease.' },
  '1010': { category: 'inorganic', healthBased: true, about: 'Barium, a metal found in natural deposits.', concern: 'High levels can cause increased blood pressure and kidney issues over time.' },
  '1015': { category: 'inorganic', healthBased: true, about: 'Cadmium, a metal from corrosion and industrial runoff.', concern: 'Long-term exposure can cause kidney damage.' },
  '1020': { category: 'inorganic', healthBased: true, about: 'Chromium, a metal from industrial discharge and natural deposits.', concern: 'Some forms are linked to cancer with long-term exposure.' },
  '1025': { category: 'inorganic', healthBased: true, about: 'Fluoride, naturally present and sometimes added for dental health.', concern: 'Excessive levels can cause bone disease and mottled teeth in children.' },
  '1030': { category: 'inorganic', healthBased: true, about: 'Mercury, a heavy metal from natural deposits and industrial runoff.', concern: 'Long-term exposure can cause kidney damage and neurological harm.' },
  '1035': { category: 'inorganic', healthBased: true, about: 'Selenium, an element from natural deposits and runoff.', concern: 'High levels can cause hair loss, numbness, and circulatory problems.' },
  '1040': { category: 'inorganic', healthBased: true, about: 'Nitrate, typically from fertilizer runoff, septic systems, and erosion.', concern: 'Dangerous for infants — can cause "blue baby syndrome" (methemoglobinemia). An acute concern for households with babies.' },
  '1041': { category: 'inorganic', healthBased: true, about: 'Nitrite, related to nitrate and from similar sources.', concern: 'Like nitrate, it is especially dangerous for infants under six months.' },
  '0999': { category: 'disinfectant', healthBased: true, about: 'Chlorine, added by the utility to disinfect the supply.', concern: 'Necessary for safety, but affects taste and odor and can irritate skin and eyes at higher residuals.' },
  '2456': { category: 'disinfection-byproduct', healthBased: true, about: 'Haloacetic Acids (HAA5), byproducts of chlorine disinfection.', concern: 'Long-term exposure is linked to increased cancer risk.' },
  '2950': { category: 'disinfection-byproduct', healthBased: true, about: 'Total Trihalomethanes (TTHM), byproducts of chlorine disinfection.', concern: 'Long-term exposure is linked to increased cancer risk and liver, kidney, and nervous system effects.' },
  '3014': { category: 'microbial', healthBased: true, about: 'E. coli, a bacterium indicating fecal contamination.', concern: 'A serious, acute health risk that can cause severe gastrointestinal illness. Immediate action is warranted.' },
  '3100': { category: 'microbial', healthBased: true, about: 'Total Coliform bacteria, an indicator of overall sanitary quality.', concern: 'Their presence can signal a pathway for disease-causing organisms to enter the supply.' },
  '8000': { category: 'monitoring', healthBased: false, about: 'The Revised Total Coliform Rule, which governs required bacterial monitoring.', concern: 'A violation usually means required samples were missed, reducing oversight of bacterial safety.' },
  '0700': { category: 'treatment', healthBased: true, about: 'The Groundwater Rule, requiring protection against microbial contamination in groundwater systems.', concern: 'A violation means required treatment or corrective steps were not fully met.' },
  '0800': { category: 'treatment', healthBased: true, about: 'The Surface Water Treatment Rule, requiring proper filtration and disinfection.', concern: 'A violation means required treatment steps were not fully met, raising contamination risk.' },
  '5000': { category: 'lead-copper', healthBased: true, about: 'The Lead and Copper Rule, which controls metals leaching from pipes.', concern: 'There is no safe level of lead, particularly for children and pregnant women.' },
  '5200': { category: 'lead-copper', healthBased: true, about: 'Lead and Copper Rule Revisions, strengthening protections against lead in plumbing.', concern: 'A violation indicates gaps in controlling lead and copper from service lines and fixtures.' },
  '4000': { category: 'radionuclide', healthBased: true, about: 'Radionuclides, radioactive elements usually from natural geology.', concern: 'Long-term exposure increases cancer risk.' },
  '4006': { category: 'radionuclide', healthBased: true, about: 'Combined Radium (226/228), a naturally occurring radioactive metal.', concern: 'Long-term exposure increases the risk of bone cancer.' },
  '4010': { category: 'radionuclide', healthBased: true, about: 'Gross Alpha particle activity, a measure of radioactivity.', concern: 'Long-term exposure increases cancer risk.' },
  '4100': { category: 'radionuclide', healthBased: true, about: 'Uranium, a naturally occurring radioactive metal.', concern: 'Long-term exposure can damage the kidneys and increase cancer risk.' },
  '7000': { category: 'other', healthBased: false, about: 'The Consumer Confidence Report rule, requiring an annual water-quality report to customers.', concern: 'A violation means the utility failed to deliver a required transparency report.' },
  '7500': { category: 'other', healthBased: false, about: 'The Public Notification rule, requiring the utility to alert customers about problems.', concern: 'A violation means required public alerts were not properly issued.' },
}

/** Infer a category from the numeric code range when a specific entry is missing. */
function categoryFromCode(code: string): ContaminantCategory {
  const n = Number.parseInt(code, 10)
  if (Number.isNaN(n)) return 'other'
  if (code === '0999') return 'disinfectant'
  if (n >= 100 && n < 1000) return 'treatment'
  if (n >= 1000 && n < 1100) return 'inorganic'
  if (n >= 2000 && n < 2400) return 'organic'
  if (n >= 2400 && n < 3000) return 'disinfection-byproduct'
  if (n >= 3000 && n < 4000) return 'microbial'
  if (n >= 4000 && n < 4200) return 'radionuclide'
  if (n >= 5000 && n < 6000) return 'lead-copper'
  if (n >= 7000 && n < 8000) return 'other'
  if (n === 8000) return 'monitoring'
  return 'other'
}

function lookup(code: string, name: string): ContaminantInfo {
  const kb = CONTAMINANT_KB[code]
  if (kb) return kb
  const category = categoryFromCode(code)
  return { category, ...CATEGORY_META[category] }
}

/** Parse an EPA "code=Name; code=Name" string into a map. */
function parseCodeString(raw: unknown): Map<string, string> {
  const map = new Map<string, string>()
  if (typeof raw !== 'string' || !raw.trim()) return map
  for (const part of raw.split(';')) {
    const [code, ...rest] = part.split('=')
    const c = code?.trim()
    const name = rest.join('=').trim()
    if (c && name) map.set(c, titleCase(name))
  }
  return map
}

function titleCase(s: string): string {
  // EPA mixes ALL CAPS and Title Case; normalize obvious all-caps names.
  if (s === s.toUpperCase() && s.length > 4) {
    return s
      .toLowerCase()
      .replace(/\b\w/g, (m) => m.toUpperCase())
      .replace(/\bHaa5\b/i, 'HAA5')
      .replace(/\bTthm\b/i, 'TTHM')
      .replace(/\bE\. Coli\b/i, 'E. coli')
  }
  return s
}

export interface RawSystem {
  PWSId?: string
  PWSName?: string
  PopulationServedCount?: string | number
  PrimarySourceDesc?: string
  GwSwCode?: string
  OwnerTypeCode?: string
  OwnerDesc?: string
  CitiesServed?: string
  CountiesServed?: string
  DfrUrl?: string
  HealthFlag?: string
  SeriousViolator?: string
  PbAle?: string
  CuAle?: string
  ViolationCategories?: string
  SDWAContaminants?: string
  SDWAContaminantsInViol3yr?: string
  SDWAContaminantsInCurViol?: string
  PWSActivityCode?: string
  PWSTypeCode?: string
}

const SEVERITY_RANK: Record<Severity, number> = { critical: 3, warning: 2, clear: 1 }

export function parseSystem(raw: RawSystem): WaterSystemResult {
  const all = parseCodeString(raw.SDWAContaminants)
  const past = parseCodeString(raw.SDWAContaminantsInViol3yr)
  const current = parseCodeString(raw.SDWAContaminantsInCurViol)
  const leadCopperExceedance = raw.PbAle === 'Yes' || raw.CuAle === 'Yes'

  // Union of every contaminant code we know about for this system.
  const codes = new Set<string>([...all.keys(), ...past.keys(), ...current.keys()])

  const contaminants: ParsedContaminant[] = []
  for (const code of codes) {
    const name = current.get(code) || past.get(code) || all.get(code) || code
    const info = lookup(code, name)

    let status: ParsedContaminant['status'] = 'monitored'
    if (current.has(code)) status = 'current'
    else if (past.has(code)) status = 'past'

    let severity: Severity = 'clear'
    if (status === 'current') severity = info.healthBased ? 'critical' : 'warning'
    else if (status === 'past') severity = 'warning'
    else severity = 'clear'

    // A lead/copper action-level exceedance is always critical.
    if (info.category === 'lead-copper' && leadCopperExceedance) severity = 'critical'

    contaminants.push({
      code,
      name,
      category: info.category,
      severity,
      status,
      healthBased: info.healthBased,
      about: info.about,
      concern: info.concern,
    })
  }

  // Sort: most severe first, then health-based, then name.
  contaminants.sort((a, b) => {
    const s = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
    if (s !== 0) return s
    if (a.healthBased !== b.healthBased) return a.healthBased ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  const summary = { critical: 0, warning: 0, clear: 0 }
  for (const c of contaminants) summary[c.severity]++

  let overallSeverity: Severity = 'clear'
  if (summary.critical > 0) overallSeverity = 'critical'
  else if (summary.warning > 0) overallSeverity = 'warning'

  return {
    pwsId: raw.PWSId || '',
    name: titleCase(raw.PWSName || 'Unknown Water System'),
    populationServed: Number(raw.PopulationServedCount) || 0,
    source: raw.PrimarySourceDesc || (raw.GwSwCode === 'SW' ? 'Surface water' : raw.GwSwCode === 'GW' ? 'Groundwater' : 'Unknown'),
    ownerType: raw.OwnerDesc || raw.OwnerTypeCode || '',
    citiesServed: raw.CitiesServed || '',
    countiesServed: raw.CountiesServed || '',
    reportUrl: raw.DfrUrl || null,
    healthFlag: raw.HealthFlag === 'Yes',
    seriousViolator: raw.SeriousViolator === 'Yes',
    leadCopperExceedance,
    violationCategories: (raw.ViolationCategories || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean),
    contaminants,
    summary,
    overallSeverity,
  }
}
