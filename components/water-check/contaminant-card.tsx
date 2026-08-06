import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParsedContaminant, Severity } from '@/lib/water-data'

const SEVERITY_STYLES: Record<
  Severity,
  { wrap: string; badge: string; icon: typeof AlertTriangle; label: string; bar: string; status: string }
> = {
  critical: {
    wrap: 'border-red-600/30 bg-red-50',
    badge: 'bg-red-600 text-white',
    icon: AlertTriangle,
    label: 'Action recommended',
    bar: 'bg-red-600',
    status: 'text-red-600',
  },
  warning: {
    wrap: 'border-amber-500/30 bg-amber-50',
    badge: 'bg-amber-500 text-white',
    icon: AlertCircle,
    label: 'Worth watching',
    bar: 'bg-amber-500',
    status: 'text-amber-600',
  },
  clear: {
    wrap: 'border-emerald-600/25 bg-emerald-50',
    badge: 'bg-emerald-600 text-white',
    icon: CheckCircle2,
    label: 'Within limits',
    bar: 'bg-emerald-600',
    status: 'text-emerald-600',
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
          <h4 className="font-sans text-lg font-bold leading-tight text-foreground text-pretty">
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

      <p className={cn('mt-3 pl-2 text-sm font-semibold', s.status)}>{STATUS_TEXT[c.status]}</p>

      <p className="mt-2 pl-2 text-sm leading-relaxed text-muted-foreground">{c.about}</p>
      <p className="mt-2 pl-2 text-sm leading-relaxed text-foreground/80">
        <span className="font-semibold text-foreground">Why it matters: </span>
        {c.concern}
      </p>
    </div>
  )
}
