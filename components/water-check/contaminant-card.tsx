import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParsedContaminant, Severity } from '@/lib/water-data'

const SEVERITY_STYLES: Record<
  Severity,
  { wrap: string; badge: string; icon: typeof AlertTriangle; label: string; bar: string }
> = {
  critical: {
    wrap: 'border-critical/30 bg-critical-soft',
    badge: 'bg-critical text-critical-foreground',
    icon: AlertTriangle,
    label: 'Action recommended',
    bar: 'bg-critical',
  },
  warning: {
    wrap: 'border-warning/30 bg-warning-soft',
    badge: 'bg-warning text-warning-foreground',
    icon: AlertCircle,
    label: 'Worth watching',
    bar: 'bg-warning',
  },
  clear: {
    wrap: 'border-success/25 bg-success-soft',
    badge: 'bg-success text-success-foreground',
    icon: CheckCircle2,
    label: 'Within limits',
    bar: 'bg-success',
  },
}

const STATUS_TEXT: Record<ParsedContaminant['status'], string> = {
  current: 'Currently exceeds EPA limits',
  past: 'Exceeded EPA limits in the last 3 years',
  monitored: 'Monitored and within EPA limits',
}

export function ContaminantCard({ c }: { c: ParsedContaminant }) {
  const s = SEVERITY_STYLES[c.severity]
  const Icon = s.icon

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 transition-shadow hover:shadow-md',
        s.wrap,
      )}
    >
      <div className={cn('absolute inset-y-0 left-0 w-1.5', s.bar)} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0">
          <h4 className="font-serif text-lg font-bold leading-tight text-foreground text-pretty">
            {c.name}
          </h4>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {c.category.replace(/-/g, ' ')}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
            s.badge,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {s.label}
        </span>
      </div>

      <p className={cn('mt-3 pl-2 text-sm font-semibold', {
        'text-critical': c.severity === 'critical',
        'text-warning': c.severity === 'warning',
        'text-success': c.severity === 'clear',
      })}>
        {STATUS_TEXT[c.status]}
      </p>

      <p className="mt-2 pl-2 text-sm leading-relaxed text-muted-foreground">{c.about}</p>
      <p className="mt-2 pl-2 text-sm leading-relaxed text-foreground/80">
        <span className="font-semibold text-foreground">Why it matters: </span>
        {c.concern}
      </p>
    </div>
  )
}
