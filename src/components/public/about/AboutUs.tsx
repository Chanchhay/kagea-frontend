import React from "react";
import AboutHeroSection from "./AboutHero";
import WhoWeAreSection from "./WhoWeAreSection";
import MissionSection from "./Mission";
import TeamSection from "./TeamSection";
import TechStackSection from "./TechStackSection";

export default function AboutUsPage() {
    return (
        <div className="landing-page relative w-full overflow-hidden bg-canvas text-body transition-colors duration-300">
            {/* Single soft ambient wash -- keeps the page calm instead of busy */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-64 left-1/2 -z-10 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-[#1fa628]/8 blur-[160px] dark:bg-[#1fa628]/12"
            />

            {/* Main Content Sections -- full page width, matching the header gutters */}
            <div className="relative mx-auto w-full max-w-[120rem] space-y-32 px-5 pt-24 pb-24 sm:px-8 lg:px-12 lg:pt-32 xl:px-16 2xl:px-24">
                {/* SECTION 1: Hero Header with Globe + Stats */}
                <AboutHeroSection />

                {/* SECTION 2: Who Are We? */}
                <WhoWeAreSection />

                {/* SECTION 3: Our Mission */}
                <MissionSection />

                {/* SECTION 4: Technology Stack Infinite Slider Showcase */}
                <TechStackSection />

                {/* SECTION 5: Meet Our Mentors + Our Members */}
                <TeamSection />
            </div>
        </div>
    );
}
