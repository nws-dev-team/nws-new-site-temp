'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, ChevronDown, ShieldCheck, Loader2 } from 'lucide-react'

const TIMEFRAMES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1 – 3 months' },
  { value: 'researching', label: 'Just researching' },
]

type FormState = {
  firstName: string
  lastName: string
  phone: string
  email: string
  homeowner: 'yes' | 'no' | ''
  timeframe: string
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  homeowner: '',
  timeframe: '',
}

export function LeadForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend wired up yet — this is a design pass. On submit we send the
    // lead to the confirmation page, which is where the Meta pixel will live.
    setStatus('submitting')
    setTimeout(() => {
      const name = form.firstName.trim()
      router.push(
        name
          ? `/free-water-test/confirmed?name=${encodeURIComponent(name)}`
          : '/free-water-test/confirmed',
      )
    }, 700)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-light leading-tight text-foreground">
          Get your $2,990 quote
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Takes under a minute. No obligation, no pressure.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName">
            <input
              id="firstName"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className={inputClass}
              placeholder="Jane"
            />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <input
              id="lastName"
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className={inputClass}
              placeholder="Doe"
            />
          </Field>
        </div>

        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
            placeholder="(555) 123-4567"
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
            placeholder="jane@email.com"
          />
        </Field>

        <Field label="Are you a homeowner?">
          <div className="grid grid-cols-2 gap-3">
            {(['yes', 'no'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => update('homeowner', option)}
                aria-pressed={form.homeowner === option}
                className={cn(
                  'h-11 rounded-lg border text-sm font-medium capitalize transition-colors',
                  form.homeowner === option
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-input bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </Field>

        <Field
          label="How soon are you hoping to get installed?"
          htmlFor="timeframe"
        >
          <div className="relative">
            <select
              id="timeframe"
              required
              value={form.timeframe}
              onChange={(e) => update('timeframe', e.target.value)}
              className={cn(
                inputClass,
                'cursor-pointer appearance-none pr-10',
                form.timeframe === '' && 'text-muted-foreground/60',
              )}
            >
              <option value="" disabled>
                Select a timeframe
              </option>
              {TIMEFRAMES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === 'submitting'}
        className="group mt-6 h-12 w-full rounded-full bg-accent text-base text-accent-foreground hover:bg-accent/90"
      >
        {status === 'submitting' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Get my quote
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
        Your information is private and never sold.
      </p>
    </form>
  )
}

const inputClass =
  'h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-3 focus:ring-accent/20'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
