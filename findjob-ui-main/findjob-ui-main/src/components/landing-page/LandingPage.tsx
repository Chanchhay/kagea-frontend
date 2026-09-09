import { ScrollReveal } from "./shared/ScrollReveal";
import FaqSection from "./FaqSection";
import HeroCompaniesSection from "./HeroCompaniesSection";
import JobDiscoverySection from "./JobDiscoverySection";
import NewestJobsSection from "./NewestJobsSection";
import ProfileSection from "./ProfileSection";
import TestimonialsSection from "./TestimonialsSection";

export default function LandingPage() {
    return (
        <>
            <div className="landing-page relative overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#181B1C] dark:text-[#F5F5F5]">
                <div className="relative z-10 mx-auto">
                    <HeroCompaniesSection />
                </div>

                <div className="relative z-10">
                    <ScrollReveal className="relative z-10">
                        <ProfileSection />
                    </ScrollReveal>

                    <ScrollReveal className="relative z-10">
                        <JobDiscoverySection />
                    </ScrollReveal>

                    <ScrollReveal direction="right" className="relative z-10">
                        <NewestJobsSection />
                    </ScrollReveal>

                    <ScrollReveal className="relative z-10">
                        <TestimonialsSection />
                    </ScrollReveal>

                    <ScrollReveal className="relative z-10">
                        <FaqSection />
                    </ScrollReveal>
                    {/* <ScrollReveal distance={56} className="relative z-10">
            <CtaBannerSection />
          </ScrollReveal> */}
                </div>
            </div>
        </>
    );
}
