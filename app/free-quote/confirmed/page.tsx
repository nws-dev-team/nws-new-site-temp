import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Phone, Clock, ClipboardCheck, PhoneCall } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quote Request Received | National Water Systems',
  description:
    'Thanks for requesting your whole-home water filtration quote. A certified specialist will reach out shortly with your $2,990 offer details.',
  robots: { index: false, follow: false },
}

const STEPS = [
  {
    icon: PhoneCall,
    title: 'We give you a call',
    body: 'A local water specialist will reach out shortly to confirm your details and answer any questions.',
  },
  {
    icon: ClipboardCheck,
    title: 'We confirm your quote',
    body: 'We walk you through exactly what is included in your $2,990 whole-home filtration system — no hidden fees.',
  },
  {
    icon: Clock,
    title: 'We schedule your install',
    body: 'Pick a time that works for you and our licensed team handles the rest. No pressure, no obligation.',
  },
]

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>
}) {
  const { name } = await searchParams
  const firstName = name?.trim()

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Minimal header — mirrors the landing page */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <img
            src="/images/nws-logo.png"
            alt="National Water Systems"
            className="h-8 w-auto sm:h-9"
          />
          <a
            href="tel:18005551234"
            className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">1-800-555-1234</span>
          </a>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Check className="h-8 w-8 text-accent" />
        </div>

        <h1 className="mt-8 text-balance font-serif text-4xl font-light leading-[1.1] tracking-tight text-foreground sm:text-5xl">
          {firstName ? `You're all set, ${firstName}.` : "You're all set."}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Your quote request for whole-home filtration at $2,990 has been
          received. Here&apos;s what happens next.
        </p>

        <ol className="mt-12 grid w-full gap-4 text-left sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                  <step.icon className="h-4 w-4 text-accent" />
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h2 className="mt-4 font-medium text-foreground">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Can&apos;t wait? Call us now and skip the line.
          </p>
          <a
            href="tel:18005551234"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <Phone className="h-4 w-4" />
            1-800-555-1234
          </a>
          <Link
              href="/free-quote"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Back to the offer page
          </Link>
        </div>
      </div>
    </main>
  )
}
