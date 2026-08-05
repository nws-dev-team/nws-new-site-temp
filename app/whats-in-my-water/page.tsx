import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { WaterCheck } from '@/components/water-check/water-check'

export const metadata: Metadata = {
  title: "What's In My Water? | National Water Systems",
  description:
    'Enter your ZIP code to see the contaminants found in your local drinking water, based on official U.S. EPA records.',
}

export default function WhatsInMyWaterPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader forceSolid />
      <Suspense fallback={<div className="min-h-[70vh]" />}>
        <WaterCheck />
      </Suspense>
      <footer className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Water quality data is sourced from the U.S. Environmental Protection Agency (EPA) ECHO
            Safe Drinking Water database and reflects reported violations for public water systems in
            your area. It represents the water system as a whole and does not measure contaminants
            introduced by your home&apos;s own plumbing. For a precise picture of the water at your
            tap, request a free in-home test.
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            National Water Systems — Every Drop, Filtered
          </p>
        </div>
      </footer>
    </main>
  )
}
