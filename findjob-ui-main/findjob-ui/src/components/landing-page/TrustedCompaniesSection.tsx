'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Company {
  name: string;
  logoPath: string;
  width: number;
  height: number;
}

const companies: Company[] = [
  { name: 'Shopify', logoPath: '/images/components/company-logo/shopify.png', width: 120, height: 40 },
  { name: 'Medium', logoPath: '/images/components/company-logo/medium.png', width: 100, height: 40 },
  { name: 'Slack', logoPath: '/images/components/company-logo/slack.png', width: 100, height: 40 },
  { name: 'Pinterest', logoPath: '/images/components/company-logo/pinterest.png', width: 100, height: 40 },
  { name: 'Wise', logoPath: '/images/components/company-logo/wise.png', width: 80, height: 40 },
  { name: 'Amazon', logoPath: '/images/components/company-logo/amazone.png', width: 120, height: 40 },
  { name: 'Spotify', logoPath: '/images/components/company-logo/spotify.svg', width: 132, height: 40 },
  { name: 'Walmart', logoPath: '/images/components/company-logo/walmart.png', width: 100, height: 40 },
  { name: 'DocuSign', logoPath: '/images/components/company-logo/docusign.png', width: 110, height: 40 },
  { name: 'Framer', logoPath: '/images/components/company-logo/framer.png', width: 90, height: 40 },
  { name: 'Webflow', logoPath: '/images/components/company-logo/webflow.png', width: 100, height: 40 },
  { name: 'Notion', logoPath: '/images/components/company-logo/notion.png', width: 90, height: 40 },
];

export default function TrustedCompaniesSection() {
  const points = [
    'Over 150,000 new job postings added every month',
    'Access job listings from 1,200+ leading companies',
    'Receive personalized job alerts for 100+ job categories.',
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left Content */}
        <div className="space-y-6">
          {/* Badge & Label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            data-reveal
            className="flex items-center gap-2.5"
          >
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Companies
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#F3BE00] tracking-wide">
              trusted by top companies
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
            data-reveal
            className="text-3xl font-extrabold tracking-tight text-[#F3BE00] sm:text-4xl lg:text-5xl leading-tight"
          >
            Get noticed by leading companies
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
            data-reveal
            className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl"
          >
            We collaborate with top organizations to bring you the best job opportunities, connecting you with leading employers who value your skills and expertise.
          </motion.p>

          {/* Bullet List with Green Number Badges */}
          <motion.div
            data-stagger
            className="space-y-4 pt-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
          >
            {points.map((text, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                }}
                className="flex items-start gap-3.5"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#008A1E] text-xs font-bold text-white shadow-xs mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                  {text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Content: Mint Green Card Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          data-reveal
          data-parallax="14"
          className="rounded-3xl bg-[#EEF6EF] dark:bg-slate-900/90 border border-emerald-100/50 dark:border-slate-800 p-8 sm:p-10 shadow-sm"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true, margin: '-100px' }}
            data-reveal
            className="text-center mb-8"
          >
            <span className="text-xs font-bold tracking-wider text-[#F3BE00] uppercase">
              TOP COMPANIES
            </span>
          </motion.div>

          {/* Logos Grid (3 columns, 4 rows) */}
          <motion.div
            data-stagger
            className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6 items-center justify-items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.4 },
              },
            }}
          >
            {companies.map((company) => (
              <motion.div
                key={company.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="flex items-center justify-center h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
              >
                <Image
                  src={company.logoPath}
                  alt={`${company.name} logo`}
                  width={company.width}
                  height={company.height}
                  className="object-contain opacity-100 brightness-90 dark:brightness-150 dark:contrast-150 contrast-125 drop-shadow-sm dark:drop-shadow-md hover:scale-110 transition-all duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
