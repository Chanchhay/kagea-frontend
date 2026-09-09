'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';

type Faq = {
  question: string;
  answer: string;
};

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

function FaqRow({ faq, index }: { faq: Faq; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200/80 dark:border-white/10">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="group flex w-full items-start gap-6 py-7 text-left"
        >
          <span className="mt-1 shrink-0 text-xs text-slate-400 dark:text-white/35">
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="flex-1 text-lg font-medium tracking-tight text-slate-900 transition-colors group-hover:text-brand sm:text-xl dark:text-white dark:group-hover:text-emerald-400">
            {faq.question}
          </span>

          <span
            aria-hidden="true"
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-hover:border-brand group-hover:text-brand dark:border-white/15 dark:text-white/50 dark:group-hover:border-emerald-400 dark:group-hover:text-emerald-400"
          >
            <Plus
              className={`size-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 pl-12 pr-14 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const { t } = useLocale();
  const faqs: Faq[] = faqKeys.map((key) => ({
    question: t(`faq.${key}`),
    answer: t(`faq.a${key.slice(1)}`),
  }));

  return (
    /*
     * Laid out straight on the page rather than inside a card: the landing
     * sections all sit on the page background with the same max-w-7xl measure
     * and gutters, and a bordered panel here read as an inset band. 78px is the
     * sticky PublicShell header, so the section fills the rest of the viewport.
     */
    <section className="flex min-h-[calc(100svh-78px)] w-full snap-start items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        data-reveal
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900 dark:bg-white" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {t('landing.questions')}
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {t('landing.faqTitle')}
            </h2>
          </div>

          <div className="border-t border-slate-200/80 dark:border-white/10">
            {faqs.map((faq, index) => (
              <FaqRow key={faq.question} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
