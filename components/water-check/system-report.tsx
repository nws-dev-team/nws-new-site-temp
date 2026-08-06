import {
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Users,
  Droplet,
  ExternalLink,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Severity, WaterSystemResult } from '@/lib/water-data'
import { buildRiskProfile } from '@/lib/water-risk'
import { ContaminantCard } from './contaminant-card'
import { RiskMeter } from './risk-meter'
import { RegionalContaminants } from './regional-contaminants'

const OVERALL: Record<
  Severity,
  { icon: typeof ShieldAlert; headline: string; sub: string; ring: string; chip: string; accent: string }
> = {
  critical: {
    icon: ShieldAlert,
    headline: 'Your water needs attention',
    sub: 'One or more health-based contaminants currently exceed EPA limits in your area.',
    ring: 'from-red-600 to-red-500',
    chip: 'bg-red-600 text-white',
    accent: 'text-red-600',
  },
  warning: {
    icon: ShieldQuestion,
    headline: 'Your water has some concerns',
    sub: 'Contaminants have exceeded EPA limits recently or monitoring issues were reported.',
    ring: 'from-amber-500 to-amber-400',
    chip: 'bg-amber-500 text-white',
    accent: 'text-amber-600',
  },
  clear: {
    icon: ShieldCheck,
    headline: 'Your water meets EPA limits',
    sub: 'No active health-based violations were found — but treatment can still improve taste, odor, and hardness.',
    ring: 'from-emerald-600 to-emerald-500',
    chip: 'bg-emerald-600 text-white',
    accent: 'text-emerald-600',
  },
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

export function SystemReport({
  system,
  location,
}: {
  system: WaterSystemResult
  location: { city: string; state: string; zip: string }
}) {
  const overall = OVERALL[system.overallSeverity]
  const OverallIcon = overall.icon
  const healthContaminants = system.contaminants.filter(
    (c) => c.severity !== 'clear',
  )
  const clearContaminants = system.contaminants.filter((c) => c.severity === 'clear')
  const profile = buildRiskProfile(system, location.zip)

  return (
    <div className="space-y-12">
      {/* 1. Urgency-forward report summary */}
      <RiskMeter profile={profile} />

      {/* 2. Contaminants commonly found in the area */}
      <RegionalContaminants profile={profile} city={location.city} state={location.state} />

      {/* 3. Official EPA record for the specific provider */}
      <div className="border-t border-border pt-10">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Official EPA Record
          </p>
          <h2 className="mt-2 font-sans text-3xl font-extrabold text-foreground text-balance">
            Your provider&apos;s compliance history
          </h2>
        </div>
      </div>

      {/* Headline summary card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className={cn('bg-gradient-to-br px-6 py-8 text-white sm:px-10', overall.ring)}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <OverallIcon className="h-8 w-8" />
              </span>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-white/80">
                  What&apos;s in your water
                </p>
                <h2 className="font-sans text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
                  {overall.headline}
                </h2>
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90">{overall.sub}</p>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4">
          <Stat icon={MapPin} label="Provider" value={system.name} />
          <Stat icon={Users} label="People served" value={formatNumber(system.populationServed)} />
          <Stat icon={Droplet} label="Source" value={system.source} />
          <Stat
            icon={OverallIcon}
            label="Contaminants flagged"
            value={`${system.summary.critical + system.summary.warning}`}
            valueClass={overall.accent}
          />
        </div>
      </div>

      {/* Severity legend / tally */}
      <div className="flex flex-wrap items-center gap-3">
        <TallyChip count={system.summary.critical} label="Action recommended" tone="critical" />
        <TallyChip count={system.summary.warning} label="Worth watching" tone="warning" />
        <TallyChip count={system.summary.clear} label="Within limits" tone="clear" />
      </div>

      {/* Flagged contaminants (the stuff that stands out) */}
      {healthContaminants.length > 0 && (
        <div>
          <h3 className="font-sans text-xl font-bold text-foreground">
            Contaminants flagged in your area
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Sorted by severity. These are the results that stood out in EPA records.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {healthContaminants.map((c) => (
              <ContaminantCard key={c.code} c={c} />
            ))}
          </div>
        </div>
      )}

      {/* Monitored / within-limits */}
      {clearContaminants.length > 0 && (
        <div>
          <h3 className="font-sans text-lg font-bold text-foreground">
            Monitored and within limits
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {clearContaminants.map((c) => (
              <ContaminantCard key={c.code} c={c} />
            ))}
          </div>
        </div>
      )}

      {healthContaminants.length === 0 && clearContaminants.length === 0 && (
        <div className="rounded-2xl border border-emerald-600/25 bg-emerald-50 p-6">
          <p className="text-sm leading-relaxed text-foreground">
            EPA records show <span className="font-semibold">no reported contaminant violations</span> for
            this system. That&apos;s good news — though public data can lag, and it doesn&apos;t
            measure hardness, taste, or contaminants below federal limits. A free in-home test tells
            you exactly what&apos;s coming out of your tap.
          </p>
        </div>
      )}

      {/* Official source link */}
      {system.reportUrl && (
        <a
          href={system.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          View the full EPA report for {system.name}
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof MapPin
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn('truncate text-sm font-bold text-foreground', valueClass)} title={value}>
          {value}
        </p>
      </div>
    </div>
  )
}

function TallyChip({
  count,
  label,
  tone,
}: {
  count: number
  label: string
  tone: Severity
}) {
  const tones: Record<Severity, string> = {
    critical: 'bg-red-600',
    warning: 'bg-amber-500',
    clear: 'bg-emerald-600',
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
      <span className={cn('h-2.5 w-2.5 rounded-full', tones[tone])} />
      <span className="font-bold text-foreground">{count}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}
