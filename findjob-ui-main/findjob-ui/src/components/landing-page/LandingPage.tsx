import { ScrollReveal } from './shared/ScrollReveal';
import CtaBannerSection from './CtaBannerSection';
import DecorativeBackground from './DecorativeBackground';
import HeroCompaniesSection from './HeroCompaniesSection';
import JobDiscoverySection from './JobDiscoverySection';
import NewestJobsSection from './NewestJobsSection';
import ProfileSection from './ProfileSection';
import TestimonialsSection from './TestimonialsSection';
import TrustedCompaniesSection from './TrustedCompaniesSection';

export default function LandingPage() {
  return (
    <>
      <div className="relative overflow-hidden bg-transparent text-slate-900 transition-colors duration-300 dark:text-slate-50">
        <DecorativeBackground />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <HeroCompaniesSection />
        </div>

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
    </>
  );
}
