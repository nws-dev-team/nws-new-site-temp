'use client'

import { useRef, useState } from 'react'
import useSWR from 'swr'
import { Search, Loader2, AlertCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Severity, WaterReport } from '@/lib/water-data'
import { SystemReport } from './system-report'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || 'Something went wrong.')
  return data as WaterReport
}

const DOT: Record<Severity, string> = {
  critical: 'bg-critical',
  warning: 'bg-warning',
  clear: 'bg-success',
}

export function WaterCheck() {
  const [zip, setZip] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const { data, error, isLoading } = useSWR(
    submitted ? `/api/water?zip=${submitted}` : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const clean = zip.trim()
    if (!/^\d{5}$/.test(clean)) return
    setSubmitted(clean)
    // Smooth-scroll to the results once the request kicks off.
    requestAnimationFrame(() => {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    })
  }

  const valid = /^\d{5}$/.test(zip.trim())

  return (
    <>
      {/* Google-style search hero */}
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Powered by official EPA data
        </span>
        <h1 className="mt-6 font-serif text-4xl font-extrabold leading-[1.05] text-foreground text-balance sm:text-6xl">
          What&apos;s in your water?
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Enter your ZIP code to see the contaminants found in your local water supply — pulled
          straight from the EPA&apos;s national drinking water records.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md">
          <div className="flex items-center gap-2 rounded-full border-2 border-border bg-card p-2 shadow-sm transition-colors focus-within:border-accent">
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter your ZIP code"
              aria-label="ZIP code"
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              disabled={!valid || isLoading}
              className="shrink-0 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Check
                  <ChevronRight className="ml-0.5 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            We never store your information. Data from the U.S. EPA ECHO database.
          </p>
        </form>
      </section>

      {/* Results */}
      <div ref={resultsRef} className="scroll-mt-20">
        {submitted && (
          <section className="mx-auto max-w-4xl px-6 pb-24">
            {isLoading && <LoadingState zip={submitted} />}

            {error && (
              <div className="mx-auto max-w-md rounded-2xl border border-critical/30 bg-critical-soft p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-critical" />
                <p className="mt-3 font-semibold text-foreground">We hit a snag</p>
                <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
              </div>
            )}

            {data && !isLoading && (
              <div className="animate-[reveal-up_0.6s_ease-out]">
                <div className="mb-8 border-b border-border pb-6">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Results for
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {data.location.city}, {data.location.state} {data.location.zip}
                  </h2>
                  {data.totalSystems > 1 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {data.totalSystems} public water systems serve this area. Showing the largest
                      one, which most likely serves your home.
                    </p>
                  )}
                </div>

                {data.featured ? (
                  <SystemReport system={data.featured} location={data.location} />
                ) : (
                  <div className="rounded-2xl border border-border bg-secondary p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      We couldn&apos;t find EPA-registered water systems for this ZIP code. Try a
                      nearby ZIP, or request a free in-home water test below.
                    </p>
                  </div>
                )}

                {data.others.length > 0 && (
                  <OtherSystems others={data.others} />
                )}

                {/* CTA */}
                <div className="mt-12 overflow-hidden rounded-3xl bg-brand-gradient px-8 py-10 text-center text-primary-foreground">
                  <h3 className="font-serif text-2xl font-extrabold text-balance">
                    Know exactly what&apos;s in your tap
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-primary-foreground/85">
                    EPA data reflects the whole system — not your home&apos;s pipes. Get a free,
                    no-obligation in-home water test and a plan to fix what we find.
                  </p>
                  <Button
                    className="mt-6 rounded-full bg-white px-8 text-primary hover:bg-white/90"
                    nativeButton={false}
                    render={<a href="tel:18005550199" />}
                  >
                    Schedule my free water test
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  )
}

function LoadingState({ zip }: { zip: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-accent" />
      <p className="mt-4 font-serif text-lg font-bold text-foreground">
        Checking EPA records for {zip}…
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Searching your local water systems and their contaminant history.
      </p>
    </div>
  )
}

function OtherSystems({ others }: { others: WaterReport['others'] }) {
  return (
    <div className="mt-12">
      <h3 className="font-serif text-xl font-bold text-foreground">
        Other water systems in your area
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        If you&apos;re served by one of these instead, here&apos;s how they rank.
      </p>
      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {others.map((o) => (
          <li key={o.pwsId} className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn('h-2.5 w-2.5 shrink-0 rounded-full', DOT[o.overallSeverity])}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{o.name}</p>
                <p className="text-xs text-muted-foreground">
                  Serves {o.populationServed.toLocaleString('en-US')} people
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right text-xs">
              {o.summary.critical + o.summary.warning > 0 ? (
                <span className="font-semibold text-foreground">
                  {o.summary.critical + o.summary.warning} flagged
                </span>
              ) : (
                <span className="font-semibold text-success">No violations</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
