import React from "react";
import AboutHeroSection from "./AboutHero";
import WhoWeAreSection from "./WhoWeAreSection";
import MissionSection from "./Mission";
import TeamSection from "./TeamSection";
import TechStackSection from "./TechStackSection";

export default function AboutUsPage() {
    return (
        <div className="landing-page relative w-full overflow-hidden bg-white text-slate-900 transition-colors duration-300 dark:bg-[#181B1C] dark:text-[#F5F5F5]">
            {/* Ambient Aurora Glow Spheres */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[38rem] w-[54rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#1fa628]/15 via-emerald-500/10 to-[#F3BE00]/10 blur-[130px] dark:from-[#1fa628]/20 dark:via-emerald-500/12 dark:to-[#F3BE00]/8"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 -left-48 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#1fa628]/10 blur-[140px] dark:bg-[#1fa628]/15"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-2/3 -right-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#F3BE00]/10 blur-[150px] dark:bg-[#1fa628]/15"
            />

            {/* Main Content Sections */}
            <div className="relative mx-auto max-w-7xl space-y-28 px-4 py-12 sm:px-6 lg:px-8">
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
