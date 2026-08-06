import { cn } from '@/lib/utils'
import type { RiskProfile, RiskLevel } from '@/lib/water-risk'

const LEVEL_TONE: Record<RiskLevel, string> = {
  Low: 'text-emerald-600',
  Moderate: 'text-amber-600',
  High: 'text-red-600',
}

function barTone(score: number): string {
  if (score >= 66) return 'bg-red-600'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-emerald-600'
}

export function RiskMeter({ profile }: { profile: RiskProfile }) {
  const { score, level, summary, breakdown } = profile
  // Position of the marker along the low→high gradient track.
  const markerPct = Math.min(96, Math.max(4, score))

  return (
    <div>
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Report Summary
        </p>
        <h2 className="mt-2 font-sans text-3xl font-extrabold text-foreground text-balance sm:text-4xl">
          What your local water profile shows.
        </h2>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Urgency gauge */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Water Risk Meter
              </p>
              <h3 className="mt-1 font-sans text-2xl font-extrabold text-foreground">
                Estimated treatment urgency
              </h3>
            </div>
            <div className="text-right leading-none">
              <div className={cn('text-5xl font-extrabold tabular-nums', LEVEL_TONE[level])}>
                {score}
              </div>
              <div className={cn('mt-1 text-sm font-bold', LEVEL_TONE[level])}>{level}</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-muted/60 p-4">
            <div className="relative h-3 rounded-full bg-border">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${markerPct}%`,
                  background:
                    'linear-gradient(90deg, #059669 0%, #d97706 55%, #dc2626 100%)',
                }}
              />
              <div
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-card bg-foreground shadow-md"
                style={{ left: `${markerPct}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 flex justify-between text-xs font-medium text-muted-foreground">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty">
            {summary}
          </p>
        </div>

        {/* Risk breakdown */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h3 className="font-sans text-2xl font-extrabold text-foreground">Risk Breakdown</h3>
          <div className="mt-6 space-y-5">
            {breakdown.map((bar) => (
              <div key={bar.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">{bar.label}</span>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {bar.score}
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                  <div
                    className={cn('h-full rounded-full transition-all', barTone(bar.score))}
                    style={{ width: `${bar.score}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{bar.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
