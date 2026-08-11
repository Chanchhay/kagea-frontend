'use client';

import { useState } from 'react';
import { jobs } from './data';
import { UsersIcon } from './icons';
import { Button } from './shared/moving-border';

const tabs = ['All', 'Development', 'Design', 'Marketing', 'Accounting'];

export default function NewestJobsSection() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* Header */}
      <div className="text-center">
        <h2 data-reveal className="text-3xl font-extrabold sm:text-4xl">
          <span className="text-[#008A1E]">Newest </span>
          <span className="text-[#F3BE00]">Jobs</span>
          <span className="text-[#008A1E]"> For You</span>
        </h2>
        <p data-reveal className="mt-2 text-xs font-semibold text-[#008A1E] sm:text-sm">
          Get The Fastest Application So That Your Name Is Above Other Application
        </p>
      </div>

      {/* Tab Navigation */}
      <div data-reveal className="mt-8 flex justify-center border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-xs sm:text-sm font-semibold transition ${
                activeTab === tab
                  ? 'text-[#008A1E] dark:text-emerald-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#008A1E] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards Grid */}
      <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Button
            key={job.id}
            as="div"
            borderRadius="1rem"
            duration={4000}
            containerClassName="h-56 w-full cursor-pointer"
            borderClassName="h-48 w-48 bg-[radial-gradient(#F3BE00_40%,transparent_60%)] opacity-100"
            className="bg-[#00921A] border-none p-0"
          >
            <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden">
              {/* Background decorative circles */}
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#007F16] opacity-60 blur-xl" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-emerald-500/20" />

              {/* Tags */}
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  Fulltime
                </span>
                <span className="rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  Onsite
                </span>
                <span className="rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  $200K
                </span>
              </div>

              {/* Job Info */}
              <div className="z-10 mt-4">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {job.title}
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  {job.company}
                </p>
              </div>

              {/* Actions */}
              <div className="z-10 mt-6 flex items-center justify-between">
                <button className="rounded-lg bg-[#F3BE00] px-6 py-2 text-xs font-bold text-slate-900 transition hover:bg-[#e0af00] active:scale-[0.98]">
                  Apply
                </button>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                  <UsersIcon />
                  <span>24 Applied</span>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}
