import { Reveal } from '@/components/reveal'
import { Star } from 'lucide-react'

const REVIEWS = [
  {
    quote:
      'The difference was immediate. No more chlorine smell, and our coffee actually tastes better. Wish we had done it years ago.',
    name: 'Marcus D.',
    location: 'Austin, TX',
  },
  {
    quote:
      'Install was clean and fast, and the water test was genuinely eye-opening. Our glassware finally comes out spotless.',
    name: 'Priya S.',
    location: 'Naperville, IL',
  },
  {
    quote:
      'Skin and hair feel completely different since the softener went in. The team was professional from test to install.',
    name: 'Jordan & Kate R.',
    location: 'Mesa, AZ',
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Reviews
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            People notice the difference.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 120} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <span className="font-medium text-foreground">
                    {review.name}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {review.location}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
