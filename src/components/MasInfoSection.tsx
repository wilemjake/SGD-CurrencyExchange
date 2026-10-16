import React from 'react';
import { ShieldCheck, HelpCircle, ArrowUpRight, Scale, Clock } from 'lucide-react';

export const MasInfoSection: React.FC = () => {
  return (
    <section id="mas-info" className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-red-600 mb-1">REGULATORY CONTEXT</div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            About MAS Exchange Rates & Singapore S$NEER
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            The Monetary Authority of Singapore (MAS) manages the Singapore Dollar using an exchange rate-centered
            monetary policy framework to maintain medium-term price stability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Card 1: S$NEER Policy Band */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 w-fit mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">The S$NEER Policy Band</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Instead of domestic interest rates, MAS conducts monetary policy through the trade-weighted
              Singapore Dollar Nominal Effective Exchange Rate (S$NEER), balancing trade competitiveness
              and imported inflation across major trading partners.
            </p>
          </div>

          {/* Card 2: 100-Unit Quotation Convention */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 w-fit mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">100-Unit Quotations</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Under official MAS reporting conventions, currencies with smaller denominations (JPY, IDR, KRW,
              THB, TWD, PHP, VND, INR) are benchmarked and published per <strong>100 units of foreign currency</strong> against the SGD.
            </p>
          </div>

          {/* Card 3: Market Reference Timings */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 w-fit mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Official Release Windows</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Daily rates represent interbank end-of-day market reference rates quoted by financial institutions
              in Singapore, compiled and released by MAS on Singapore banking business days at 16:30 SGT.
            </p>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500">
          <span className="text-slate-400">Official Resources:</span>
          <a
            href="https://eservices.mas.gov.sg/statistics/dir/exchangerates.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-700 hover:text-red-600 transition-colors"
          >
            <span>MAS Official Exchange Rates Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=22731872-466f-45a7-96a9-0639d6ff5141"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-700 hover:text-red-600 transition-colors"
          >
            <span>MAS DataStore API Documentation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
