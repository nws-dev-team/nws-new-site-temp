import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { Droplets, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

export function CtaFooter() {
  return (
    <>
      <section id="quote" className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="bg-brand-gradient relative overflow-hidden rounded-[2rem] px-8 py-14 text-center text-primary-foreground sm:px-16 sm:py-20">
              <Droplets
                aria-hidden
                className="animate-drift absolute -right-6 -top-6 h-40 w-40 text-primary-foreground/10"
              />
              <Droplets
                aria-hidden
                className="animate-drift absolute -bottom-10 -left-8 h-52 w-52 text-primary-foreground/10"
                style={{ animationDelay: '2s' }}
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-balance font-serif text-3xl font-light leading-tight tracking-tight sm:text-5xl">
                  Find out what&apos;s really in your water.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
                  Book a free, no-obligation water test. We&apos;ll show you the
                  results and recommend the right system, only if you need one.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="group h-12 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/90"
                    nativeButton={false}
                    render={<a href="tel:18005551234" />}
                  >
                    Schedule my free test
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <a
                    href="tel:18005551234"
                    className="flex items-center gap-2 text-primary-foreground/90 transition-colors hover:text-primary-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    1-800-555-1234
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <img
                src="/images/nws-logo.png"
                alt="National Water Systems"
                className="h-10 w-auto"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Premium whole-home water treatment, engineered and installed by
                certified specialists.
              </p>
            </div>

            <FooterCol
              title="Systems"
              links={[
                'Whole-Home Filtration',
                'Water Softeners',
                'Reverse Osmosis',
                'Well Water Solutions',
              ]}
            />
            <FooterCol
              title="Company"
              links={['About Us', 'Our Process', 'Reviews', 'Careers']}
            />

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Contact
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  1-800-555-1234
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  hello@nationalwatersystem.com
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Nationwide service
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} National Water Systems. All
              rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-3 text-sm">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
