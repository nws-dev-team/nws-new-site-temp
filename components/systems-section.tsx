import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Check } from 'lucide-react'

const SYSTEMS = [
  {
    name: 'Whole-Home Filtration',
    tagline: 'Point-of-entry protection',
    image: '/images/system-install.png',
    features: [
      'Reduces chlorine, sediment & odor',
      'Protects every faucet and appliance',
      'Up to 1,000,000 gallon capacity',
    ],
    featured: true,
  },
  {
    name: 'Water Softener',
    tagline: 'End hard-water buildup',
    image: '/images/product-unit.png',
    features: [
      'Eliminates scale on fixtures',
      'Softer skin, brighter laundry',
      'Smart metered regeneration',
    ],
    featured: false,
  },
  {
    name: 'Reverse Osmosis',
    tagline: 'Drinking-water perfection',
    image: '/images/family-water.png',
    features: [
      'Bottled-quality at the tap',
      'Removes PFAS, lead & TDS',
      'Compact under-sink design',
    ],
    featured: false,
  },
]

export function SystemsSection() {
  return (
    <section id="systems" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Our systems
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Engineered for your home, not a warehouse.
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Every install starts with a free water test, so you get the right
            system for your water, your household, and your budget.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {SYSTEMS.map((system, i) => (
            <Reveal key={system.name} delay={i * 120} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={system.image || '/placeholder.svg'}
                    alt={system.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {system.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                    {system.tagline}
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl text-foreground">
                    {system.name}
                  </h3>
                  <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                    {system.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="ghost"
                    className="mt-6 justify-start px-0 text-primary hover:bg-transparent hover:text-primary"
                    nativeButton={false}
                    render={<a href="#quote" />}
                  >
                    Learn more
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
