import { AlertTriangle, AlertCircle, Circle, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Presence, RegionalContaminant, RiskProfile } from '@/lib/water-risk'

const PRESENCE: Record<
  Presence,
  { label: string; badge: string; card: string; dot: string; icon: typeof AlertTriangle }
> = {
  detected: {
    label: 'Commonly detected',
    badge: 'bg-red-600 text-white',
    card: 'border-red-600/35 bg-red-50',
    dot: 'bg-red-600',
    icon: AlertTriangle,
  },
  likely: {
    label: 'Likely present',
    badge: 'bg-amber-500 text-white',
    card: 'border-amber-500/35 bg-amber-50',
    dot: 'bg-amber-500',
    icon: AlertCircle,
  },
  possible: {
    label: 'Possible',
    badge: 'bg-muted text-muted-foreground',
    card: 'border-border bg-card',
    dot: 'bg-muted-foreground/50',
    icon: Circle,
  },
}

export function RegionalContaminants({
  profile,
  city,
  state,
}: {
  profile: RiskProfile
  city: string
  state: string
}) {
  const { contaminants, detectedCount, hardness } = profile

  return (
    <div>
      {/* Urgent lead-in */}
      <div className="rounded-3xl border border-red-600/30 bg-red-50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
              <AlertTriangle className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-red-600">
                Contaminants of concern
              </p>
              <h2 className="font-sans text-2xl font-extrabold leading-tight text-foreground text-balance sm:text-3xl">
                {detectedCount} contaminants commonly found in {city} water
              </h2>
            </div>
          </div>
          <div className="shrink-0 rounded-2xl border border-red-600/25 bg-card px-5 py-3 text-center">
            <div className="text-3xl font-extrabold tabular-nums text-red-600">
              {detectedCount}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              of {contaminants.length} screened
            </div>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/80">
          These contaminants are commonly present in public water serving {city}, {state}. Most are
          invisible, odorless, and stay within federal reporting limits — which means they often go
          unnoticed until they affect your health, your appliances, or your water bill.
        </p>
      </div>

      {/* Hard water callout */}
      <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-amber-500/30 bg-amber-50 p-6 sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
          <Droplets className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 className="font-sans text-lg font-bold text-foreground">
              Your water is {hardness.classification.toLowerCase()}
            </h3>
            <span className="text-sm font-bold text-amber-600">
              ~{hardness.grains} grains per gallon
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-foreground/80">
            {hardness.label} water leaves limescale that clogs fixtures, stains sinks, dries out
            skin and hair, and can cut the lifespan of a water heater by years. A softener is the
            most common fix.
          </p>
        </div>
      </div>

      {/* Contaminant grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contaminants.map((c) => (
          <Card key={c.name} c={c} />
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Presence is estimated from EPA records and regional source-water data for this area. Only an
        in-home test confirms the exact levels at your tap — which is why we offer it free.
      </p>
    </div>
  )
}

function Card({ c }: { c: RegionalContaminant }) {
  const p = PRESENCE[c.presence]
  const Icon = p.icon
  return (
    <div className={cn('flex flex-col rounded-2xl border p-5 transition-shadow hover:shadow-md', p.card)}>
      <span
        className={cn(
          'inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
          p.badge,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {p.label}
      </span>
      <h4 className="mt-3 font-sans text-lg font-bold leading-tight text-foreground text-pretty">
        {c.name}
      </h4>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {c.category}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.concern}</p>
    </div>
  )
}
