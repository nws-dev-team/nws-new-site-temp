import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const STATS = [
  { value: '50k+', label: 'Homes protected' },
  { value: '99.9%', label: 'Contaminants reduced' },
  { value: '10yr', label: 'System warranty' },
  { value: '4.9', label: 'Average rating' },
]

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-24">
      <Image
        src="/images/family-water.png"
        alt=""
        fill
        aria-hidden
        className="object-cover opacity-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            Trusted by families across the country.
          </h2>
        </Reveal>
        <dl className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="text-center">
              <dt className="font-serif text-4xl font-light text-accent sm:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm uppercase tracking-[0.14em] text-primary-foreground/70">
                {stat.label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
