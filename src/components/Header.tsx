import React from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { MasApiConfig } from '../types/currency';

interface HeaderProps {
  config: MasApiConfig;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenConfig: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isRefreshing,
  onRefresh,
  onOpenConfig,
  onNavigateSection,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand wordmark (single text element wordmark in display face) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateSection('calculator')}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                  SingaRate
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/60 tracking-wider">
                  SGD
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigateSection('calculator')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Calculator
            </button>
            <button
              onClick={() => onNavigateSection('rates')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Exchange Rates
            </button>
            <button
              onClick={() => onNavigateSection('favorites')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Watchlist
            </button>
            <button
              onClick={() => onNavigateSection('basket')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Multi-Currency Basket
            </button>
            <button
              onClick={() => onNavigateSection('mas-info')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              MAS Benchmarks
            </button>
          </nav>

          {/* Zone 3: 1 primary action / utility area */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh rates against SGD"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Refresh exchange rates"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <button
              onClick={onOpenConfig}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>MAS API Keys</span>
              {config.apiKey ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
