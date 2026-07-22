'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Systems', href: '#systems' },
  { label: 'Your Water', href: '#water' },
  { label: 'How It Works', href: '#process' },
  { label: 'Reviews', href: '#reviews' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          aria-label="National Water Systems home"
          className="relative flex items-center"
        >
          {/* Full-color logo: visible once the header is solid */}
          <img
            src="/images/nws-logo.png"
            alt="National Water Systems"
            className={cn(
              'h-8 w-auto transition-opacity duration-300 sm:h-9',
              scrolled ? 'opacity-100' : 'opacity-0',
            )}
          />
          {/* White logo: visible over the dark hero */}
          <img
            src="/images/nws-logo-white.png"
            alt=""
            aria-hidden="true"
            className={cn(
              'absolute inset-0 h-8 w-auto transition-opacity duration-300 sm:h-9 [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.55))]',
              scrolled ? 'opacity-0' : 'opacity-100',
            )}
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled
                  ? 'text-muted-foreground hover:text-foreground'
                  : 'text-primary-foreground/80 hover:text-primary-foreground',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:18005550199"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors',
              scrolled
                ? 'text-foreground hover:text-primary'
                : 'text-primary-foreground hover:text-accent',
            )}
          >
            <Phone className="h-4 w-4" />
            1-800-555-0199
          </a>
          <Button
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            nativeButton={false}
            render={<a href="#quote" />}
          >
            Free water test
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full md:hidden',
            scrolled
              ? 'text-foreground'
              : 'bg-primary-foreground/10 text-primary-foreground',
          )}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </a>
            ))}
            <Button
              className="mt-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              nativeButton={false}
              render={<a href="#quote" onClick={() => setOpen(false)} />}
            >
              Free water test
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
