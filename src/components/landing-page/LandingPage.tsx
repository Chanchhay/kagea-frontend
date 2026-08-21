import { ScrollReveal } from './shared/ScrollReveal';
import CtaBannerSection from './CtaBannerSection';
import DecorativeBackground from './DecorativeBackground';
import HeroCompaniesSection from './HeroCompaniesSection';
import InteractiveParticleBand from './InteractiveParticleBand';
import JobDiscoverySection from './JobDiscoverySection';
import NewestJobsSection from './NewestJobsSection';
import ProfileSection from './ProfileSection';
import TestimonialsSection from './TestimonialsSection';
import TrustedCompaniesSection from './TrustedCompaniesSection';

export default function LandingPage() {
  return (
    <>
      <div className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0B0F19] dark:text-slate-50">
        {/* Full Landing Page Particles.js Canvas Background */}
        <InteractiveParticleBand className="absolute inset-0 z-0 h-full w-full pointer-events-none" />

        <div className="pointer-events-none absolute inset-0 hidden dark:block z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(22,163,74,0.12),transparent_30%),radial-gradient(circle_at_72%_16%,rgba(234,179,8,0.05),transparent_18%)]" />
        </div>
        <DecorativeBackground />

        <div className="relative z-10 mx-auto">
          <HeroCompaniesSection />
        </div>

        <div className="relative z-10">
          <ScrollReveal delay={0.05} className="relative z-10">
            <ProfileSection />
          </ScrollReveal>

          <ScrollReveal delay={0.08} direction="left" className="relative z-10">
            <TrustedCompaniesSection />
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="relative z-10">
            <JobDiscoverySection />
          </ScrollReveal>

          <ScrollReveal delay={0.12} direction="right" className="relative z-10">
            <NewestJobsSection />
          </ScrollReveal>

          <ScrollReveal delay={0.14} className="relative z-10">
            <TestimonialsSection />
          </ScrollReveal>

          <ScrollReveal delay={0.16} distance={56} className="relative z-10">
            <CtaBannerSection />
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
