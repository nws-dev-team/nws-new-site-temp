import { Reveal } from '@/components/reveal'
import { Beaker, Droplet, Sparkles, Wind } from 'lucide-react'

const CONTAMINANTS = [
  {
    icon: Beaker,
    name: 'Chlorine & chloramine',
    detail: 'The taste and smell of municipal treatment, stripped at the source.',
  },
  {
    icon: Droplet,
    name: 'Hardness minerals',
    detail: 'Calcium and magnesium that scale pipes, spot glassware, and dry skin.',
  },
  {
    icon: Wind,
    name: 'Sediment & rust',
    detail: 'Fine particulates that cloud water and wear down appliances.',
  },
  {
    icon: Sparkles,
    name: 'PFAS & lead',
    detail: 'The contaminants you cannot see, reduced to trace levels.',
  },
]

export function WaterProblem() {
  return (
    <section id="water" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What&apos;s in your water?
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              You can&apos;t taste peace of mind.
              <span className="italic text-primary"> But you&apos;ll notice it.</span>
            </h2>
            <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              Most homes are fed water that meets the minimum standard and
              nothing more. Our systems go further, filtering the things you
              can taste and the ones you can&apos;t, so what comes out of every
              tap is genuinely clean.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {CONTAMINANTS.map((item, i) => (
              <Reveal key={item.name} delay={i * 100}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-medium text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
