import { SiteHeader } from '@/components/site-header'
import { VideoHero } from '@/components/video-hero'
import { WaterProblem } from '@/components/water-problem'
import { SystemsSection } from '@/components/systems-section'
import { HowItWorks } from '@/components/how-it-works'
import { StatsBand } from '@/components/stats-band'
import { Testimonials } from '@/components/testimonials'
import { CtaFooter } from '@/components/cta-footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <VideoHero />
      <WaterProblem />
      <SystemsSection />
      <HowItWorks />
      <StatsBand />
      <Testimonials />
      <CtaFooter />
    </main>
  )
}
