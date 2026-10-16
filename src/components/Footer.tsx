import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-white font-bold text-base">
              <span>SingaRate</span>
              <span className="text-red-500 font-mono text-xs">SGD</span>
            </div>
            <p className="mt-1 text-slate-400 text-xs max-w-md leading-relaxed">
              Real-time Singapore Dollar currency conversion tool referencing official Monetary Authority of Singapore (MAS) conventions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a href="#calculator" className="hover:text-white transition-colors">Calculator</a>
            <a href="#rates" className="hover:text-white transition-colors">Live Rates</a>
            <a href="#basket" className="hover:text-white transition-colors">Watchlist Basket</a>
            <a href="#mas-info" className="hover:text-white transition-colors">MAS Benchmarks</a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Rates displayed are indicative benchmarks. Real-world retail transaction rates may vary depending on intermediary spreads,
            wire commissions, and retail counter markups.
          </p>
          <div className="shrink-0 text-slate-400">
            Singapore SGT Timezone (UTC+8)
          </div>
        </div>
      </div>
    </footer>
  );
};
