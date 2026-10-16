import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, ChevronDown, Check, Sparkles, Building2, CreditCard, Store, HelpCircle } from 'lucide-react';
import { Currency } from '../types/currency';
import { FlagIcon } from './FlagIcon';

interface HeroCalculatorProps {
  currencies: Currency[];
  selectedCode: string;
  onSelectCurrency: (code: string) => void;
  onOpenDetails: (currency: Currency) => void;
}

export const HeroCalculator: React.FC<HeroCalculatorProps> = ({
  currencies,
  selectedCode,
  onSelectCurrency,
  onOpenDetails,
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [direction, setDirection] = useState<'SGD_TO_FOREIGN' | 'FOREIGN_TO_SGD'>('SGD_TO_FOREIGN');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feeBreakdownOpen, setFeeBreakdownOpen] = useState(true);

  const selectedCurrency = useMemo(() => {
    return currencies.find((c) => c.code === selectedCode) || currencies[0];
  }, [currencies, selectedCode]);

  // Filter currencies for the dropdown
  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return currencies;
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [currencies, searchQuery]);

  // Conversion calculations
  const { convertedAmount, formattedResult, rateQuoteText, inverseQuoteText } = useMemo(() => {
    if (!selectedCurrency) {
      return {
        convertedAmount: 0,
        formattedResult: '0.00',
        rateQuoteText: '',
        inverseQuoteText: '',
      };
    }

    let result = 0;
    if (direction === 'SGD_TO_FOREIGN') {
      result = amount * selectedCurrency.rate;
    } else {
      result = amount / selectedCurrency.rate;
    }

    const precision = selectedCurrency.rate > 1000 ? 0 : selectedCurrency.rate > 10 ? 2 : 4;
    const formatted = result.toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    const rateQuote = `1 SGD = ${selectedCurrency.rate.toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })} ${selectedCurrency.code}`;

    const inverseVal = (1 / selectedCurrency.rate).toFixed(4);
    const inverseQuote = `1 ${selectedCurrency.code} = ${inverseVal} SGD`;

    return {
      convertedAmount: result,
      formattedResult: formatted,
      rateQuoteText: rateQuote,
      inverseQuoteText: inverseQuote,
    };
  }, [amount, direction, selectedCurrency]);

  const handleSwapDirection = () => {
    setDirection((prev) => (prev === 'SGD_TO_FOREIGN' ? 'FOREIGN_TO_SGD' : 'SGD_TO_FOREIGN'));
  };

  const handleQuickAdd = (increment: number) => {
    setAmount((prev) => Math.max(0, prev + increment));
  };

  const handlePreset = (val: number) => {
    setAmount(val);
  };

  return (
    <section id="calculator" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Kicker and Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <span className="font-semibold text-red-600">Monetary Authority of Singapore (MAS)</span>
            <span aria-hidden="true">·</span>
            <span>Official Daily Reference Rates</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-semibold">Live Quotes Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Singapore Dollar (SGD) Currency Converter
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">
            Real-time indicative exchange rates for the Singapore Dollar against 20+ major global currencies,
            conforming to MAS market quoting conventions.
          </p>
        </div>

        {/* Main Grid: Calculator Card + Channel Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Calculator Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7">
            {/* Conversion Direction Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {direction === 'SGD_TO_FOREIGN' ? 'Singapore Dollar to Foreign Currency' : 'Foreign Currency to SGD'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSwapDirection}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap Direction</span>
              </button>
            </div>

            {/* Inputs Container */}
            <div className="mt-6 space-y-4">
              {/* Row 1: Source Currency / Amount */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
                  <label htmlFor="calculator-amount-input">You convert</label>
                  <span>
                    {direction === 'SGD_TO_FOREIGN' ? 'Base: Singapore Dollar' : `Source: ${selectedCurrency?.name}`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <input
                      id="calculator-amount-input"
                      type="number"
                      min="0"
                      step="any"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-bold text-slate-900 focus:outline-hidden tabular-nums"
                      placeholder="1000"
                    />
                  </div>
                  <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                    {direction === 'SGD_TO_FOREIGN' ? (
                      <>
                        <FlagIcon code="SG" className="w-6 h-4" />
                        <span className="font-bold text-sm text-slate-800">SGD</span>
                      </>
                    ) : (
                      <>
                        <FlagIcon code={selectedCurrency?.flagCode || selectedCode} className="w-6 h-4" />
                        <span className="font-bold text-sm text-slate-800">{selectedCurrency?.code}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Quick amount:</span>
                  {[500, 1000, 2500, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePreset(val)}
                      className={`px-2 py-0.5 text-xs rounded-md transition-colors cursor-pointer ${
                        amount === val
                          ? 'bg-red-600 text-white font-medium'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(100)}
                      className="px-2 py-0.5 text-xs rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      +100
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(1000)}
                      className="px-2 py-0.5 text-xs rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      +1k
                    </button>
                  </div>
                </div>
              </div>

              {/* Swap Button Divider */}
              <div className="relative flex items-center justify-center -my-2 z-10">
                <button
                  type="button"
                  onClick={handleSwapDirection}
                  className="p-2 bg-white rounded-full border border-slate-200 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
                  title="Invert conversion"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Row 2: Converted Amount / Currency Selector */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
                  <span>You receive (Estimated)</span>
                  <span>{direction === 'SGD_TO_FOREIGN' ? selectedCurrency?.country : 'Singapore'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 overflow-x-auto">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                      {formattedResult}
                    </div>
                  </div>

                  {/* Target Currency Selector Pill / Dropdown trigger */}
                  <div className="relative shrink-0">
                    {direction === 'SGD_TO_FOREIGN' ? (
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <FlagIcon code={selectedCurrency?.flagCode || selectedCode} className="w-6 h-4" />
                        <span className="font-bold text-sm text-slate-800">{selectedCurrency?.code}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                        <FlagIcon code="SG" className="w-6 h-4" />
                        <span className="font-bold text-sm text-slate-800">SGD</span>
                      </div>
                    )}

                    {/* Currency Selector Modal / Dropdown */}
                    {isDropdownOpen && direction === 'SGD_TO_FOREIGN' && (
                      <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                        <div className="p-2 border-b border-slate-100">
                          <input
                            type="text"
                            placeholder="Search currency or country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-red-500"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50">
                          {filteredCurrencies.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                onSelectCurrency(c.code);
                                setIsDropdownOpen(false);
                                setSearchQuery('');
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${
                                c.code === selectedCode ? 'bg-red-50 text-red-900' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <FlagIcon code={c.flagCode} className="w-5 h-3.5" />
                                <div>
                                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                    <span>{c.code}</span>
                                    <span className="text-[10px] text-slate-500 font-normal">({c.name})</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400">{c.country}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-mono font-medium text-slate-700 tabular-nums">
                                  {c.rate > 1000 ? c.rate.toFixed(0) : c.rate.toFixed(c.rate > 10 ? 2 : 4)}
                                </div>
                                {c.code === selectedCode && <Check className="w-3.5 h-3.5 text-red-600 ml-auto mt-0.5" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono tabular-nums">{rateQuoteText}</span>
                  <button
                    type="button"
                    onClick={() => onOpenDetails(selectedCurrency)}
                    className="text-red-600 hover:text-red-700 font-medium hover:underline cursor-pointer"
                  >
                    View Chart & Trends &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* MAS Quoting Convention Notice */}
            {selectedCurrency?.masPerHundred && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">MAS Quotation Standard: </span>
                  The Monetary Authority of Singapore quotes {selectedCurrency.name} ({selectedCurrency.code}) per{' '}
                  <strong>100 units</strong>. (Official benchmark: 100 {selectedCurrency.code} = SGD{' '}
                  {(selectedCurrency.inverseRate).toFixed(4)}).
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Singapore Real-World Channel Rate Comparison (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Exchange Channels in Singapore</h3>
              </div>
              <button
                type="button"
                onClick={() => setFeeBreakdownOpen(!feeBreakdownOpen)}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                {feeBreakdownOpen ? 'Hide' : 'Show'}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Comparison for converting <strong>{amount.toLocaleString()} SGD</strong> to{' '}
              <strong>{selectedCurrency?.code}</strong> across popular Singapore conversion methods:
            </p>

            {feeBreakdownOpen && (
              <div className="mt-4 space-y-3">
                {/* 1. MAS Mid-market reference */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">MAS Mid-Market Reference</div>
                        <div className="text-[11px] text-slate-500">Official benchmark (Zero spread)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {(amount * selectedCurrency.rate).toLocaleString('en-US', {
                          maximumFractionDigits: selectedCurrency.rate > 100 ? 0 : 2,
                        })}{' '}
                        {selectedCurrency.code}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium">Baseline (0% markup)</div>
                    </div>
                  </div>
                </div>

                {/* 2. Multi-Currency Travel Cards (Wise, YouTrip, Trust) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Multi-Currency Card</div>
                        <div className="text-[11px] text-slate-500">Wise / YouTrip / Trust (~0.35% spread)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {(amount * selectedCurrency.rate * 0.9965).toLocaleString('en-US', {
                          maximumFractionDigits: selectedCurrency.rate > 100 ? 0 : 2,
                        })}{' '}
                        {selectedCurrency.code}
                      </div>
                      <div className="text-[10px] text-slate-500">Save ~SGD {(amount * 0.015).toFixed(2)} vs banks</div>
                    </div>
                  </div>
                </div>

                {/* 3. Local Money Changers (The Arcade, Mustafa) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                        <Store className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Physical Money Changers</div>
                        <div className="text-[11px] text-slate-500">The Arcade (Raffles Place) / Mustafa (~0.6% spread)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {(amount * selectedCurrency.rate * 0.994).toLocaleString('en-US', {
                          maximumFractionDigits: selectedCurrency.rate > 100 ? 0 : 2,
                        })}{' '}
                        {selectedCurrency.code}
                      </div>
                      <div className="text-[10px] text-slate-500">Cash notes</div>
                    </div>
                  </div>
                </div>

                {/* 4. Retail Bank Telegraphic / Over Counter (DBS, OCBC, UOB) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Standard Bank Counter</div>
                        <div className="text-[11px] text-slate-500">DBS / OCBC / UOB standard FX (~1.85% markup)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {(amount * selectedCurrency.rate * 0.9815).toLocaleString('en-US', {
                          maximumFractionDigits: selectedCurrency.rate > 100 ? 0 : 2,
                        })}{' '}
                        {selectedCurrency.code}
                      </div>
                      <div className="text-[10px] text-amber-700 font-medium">-SGD {(amount * 0.0185).toFixed(2)} markup</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Button */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Quotes updated daily per MAS release</span>
              <button
                type="button"
                onClick={() => onOpenDetails(selectedCurrency)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
