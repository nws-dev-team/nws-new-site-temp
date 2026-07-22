import { Reveal } from '@/components/reveal'
import { ClipboardCheck, Wrench, Droplets } from 'lucide-react'

const STEPS = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'Free water test',
    detail:
      'A certified specialist visits your home, tests your water, and shows you exactly what is in it. No pressure, no obligation.',
  },
  {
    icon: Wrench,
    step: '02',
    title: 'Custom install',
    detail:
      'Licensed installers fit the right system for your household in a single visit, cleanly and to code.',
  },
  {
    icon: Droplets,
    step: '03',
    title: 'Enjoy clean water',
    detail:
      'Taste the difference from day one, backed by ongoing service and a 10-year warranty on every system.',
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            How it works
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Clean water in three simple steps.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 140} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/70">
                  Step {step.step}
                </span>
                <h3 className="mt-1 font-serif text-xl text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
