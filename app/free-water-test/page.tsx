import type { Metadata } from 'next'
import { LeadForm } from '@/components/lead-form'
import { Droplets, ShieldCheck, Star, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Whole-Home Water Filtration for $2,990 | National Water Systems',
  description:
    'Get whole-home water filtration installed for $2,990 — hard water, chlorine, and contaminants gone. Request your free quote from a certified specialist today.',
}

const BENEFITS = [
  'Whole-home filtration — every tap, every faucet',
  'Removes hard water, chlorine & common contaminants',
  'Professional installation by licensed technicians',
  'NSF-certified system with a 10-year warranty',
]

export default function FreeWaterTestPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Minimal header — no nav distractions on an ad landing page */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <img
            src="/images/nws-logo.png"
            alt="National Water Systems"
            className="h-8 w-auto sm:h-9"
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-16">
        {/* Value proposition */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent">
            <Droplets className="h-3.5 w-3.5" />
            Limited-time offer
          </span>

          <h1 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Whole-home water filtration for{' '}
            <span className="text-brand-gradient italic">$2,990.</span>
          </h1>

          <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Clean, filtered water at every tap — hard water, chlorine, and hidden
            contaminants gone for good. Fully installed by our licensed team.
            Request your quote to lock in this price.
          </p>

          <ul className="mt-8 grid gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-pretty text-sm leading-relaxed text-foreground">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-1.5">
              <div className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                4.9/5 from 2,000+ homeowners
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Licensed &amp; insured installers
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <img
              src="/images/lp-kitchen-water.png"
              alt="Crystal-clear water being poured into a glass in a bright modern kitchen"
              className="h-52 w-full object-cover sm:h-64"
            />
          </div>
        </div>

        {/* Lead form */}
        <div className="lg:pt-4">
          <div className="lg:sticky lg:top-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </main>
  )
}
