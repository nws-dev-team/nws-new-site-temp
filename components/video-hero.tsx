'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Droplets, ArrowRight, Play, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    src: '/videos/custom1.mp4',
    caption: 'Purity you can see',
  },
  {
    src: '/videos/custom2.mp4',
    caption: 'Softer water, softer living',
  },
  {
    src: '/videos/custom3.mp4',
    caption: 'From the source, to your tap',
  },
  {
    src: '/videos/custom4.mp4',
    caption: 'Every drop, filtered',
  },
  {
    src: '/videos/custom5.mp4',
    caption: 'Water the way it should taste',
  },
]

export function VideoHero() {
  const [active, setActive] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const goTo = useCallback((index: number) => {
    setActive((prev) => (index === prev ? prev : index))
  }, [])

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % SLIDES.length)
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active) {
        video.currentTime = 0
        const playPromise = video.play()
        if (playPromise) playPromise.catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active])

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-primary text-primary-foreground">
      {/* Video layers */}
      {SLIDES.map((slide, i) => (
        <video
          key={slide.src}
          ref={(el) => {
            videoRefs.current[i] = el
          }}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          poster="/images/hero-poster.png"
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          onEnded={next}
          aria-hidden={i !== active}
          suppressHydrationWarning
        >
          <source src={slide.src} type="video/mp4" />
        </video>
      ))}

      {/* Tints for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/30 to-primary/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur-sm">
            <Droplets className="h-3.5 w-3.5 text-accent" />
            Every Drop, Filtered
          </span>

          <h1 className="mt-6 text-pretty font-serif text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Water the way
            <br />
            it was{' '}
            <span className="italic text-accent">meant to be.</span>
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Whole-home filtration and softening that strips out contaminants,
            ends hard-water buildup, and makes every glass taste remarkably
            clean.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="group h-12 rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90"
              nativeButton={false}
              render={<a href="#quote" />}
            >
              Get a free water test
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary-foreground/30 bg-primary-foreground/5 px-7 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/15 hover:text-primary-foreground"
              nativeButton={false}
              render={<a href="#systems" />}
            >
              <Play className="mr-1 h-4 w-4" />
              Explore systems
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-primary-foreground/70">
            <ShieldCheck className="h-4 w-4 text-accent" />
            NSF-certified media &middot; 10-year warranty &middot; Licensed
            installers
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              className="group flex items-center gap-2"
              aria-label={`Show video ${i + 1}: ${slide.caption}`}
              aria-current={i === active}
            >
              <span
                className={cn(
                  'h-1 rounded-full bg-primary-foreground/30 transition-all duration-500',
                  i === active
                    ? 'w-10 bg-accent'
                    : 'w-5 group-hover:bg-primary-foreground/60',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
