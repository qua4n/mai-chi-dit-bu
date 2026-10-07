import type { FC } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const DAYS_TO_PAUSE = (Date.UTC(2026, 8, 24) - Date.UTC(2025, 3, 20)) / 86_400_000;

const LoveTimer: FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto max-w-xl"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative rotate-[-1deg] overflow-hidden border-2 border-dashed border-[#c4bcb0] bg-[#fffdf8] p-8 shadow-[0_14px_40px_-20px_rgba(40,39,34,0.18)] sm:p-12">
        {/* Pin */}
        <div className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-[#873f43] shadow-[0_2px_4px_rgba(0,0,0,0.25)] sm:top-4" aria-hidden="true" />

        {/* Stamp mark */}
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8" aria-hidden="true">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 rotate-6 flex-col items-center justify-center rounded border-2 border-dashed border-[#873f43]/40 bg-[#fffaf2] text-[#873f43]">
            <span className="text-[9px] font-semibold uppercase tracking-widest">Pause</span>
            <span className="text-[10px] font-bold">2026</span>
          </div>
        </div>

        {/* Postcard lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-[#d6c9b8]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-3 h-px bg-[#d6c9b8]/60" aria-hidden="true" />

        {/* Header */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#873f43]">Khoảng thời gian</p>

        {/* Days count */}
        <div className="mt-8 sm:mt-10">
          <p className="text-serif text-[clamp(5rem,12vw,7.5rem)] leading-none tabular-nums tracking-[-0.09em] text-[#282722]">{DAYS_TO_PAUSE}</p>
          <p className="mt-2 text-serif text-2xl italic text-[#77766e]">ngày đồng hành</p>
        </div>

        {/* Postcard dates */}
        <div className="mt-8 border-t border-[#d6c9b8] pt-5 sm:mt-10">
          <p className="font-['Courier_New',monospace] text-sm tracking-wide text-[#66645d]">
            <time dateTime="2025-04-20">20.04.2025</time> — <time dateTime="2026-09-24">24.09.2026</time>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoveTimer;
