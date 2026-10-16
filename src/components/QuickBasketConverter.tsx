import React, { useState } from 'react';
import { Copy, Check, Plus, Star } from 'lucide-react';
import { Currency } from '../types/currency';
import { FlagIcon } from './FlagIcon';

interface QuickBasketConverterProps {
  currencies: Currency[];
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  onOpenDetails: (currency: Currency) => void;
}

export const QuickBasketConverter: React.FC<QuickBasketConverterProps> = ({
  currencies,
  favorites,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const [basketAmount, setBasketAmount] = useState<number>(1000);
  const [copied, setCopied] = useState(false);

  const basketCurrencies = currencies.filter((c) => favorites.includes(c.code));

  const handleCopySummary = () => {
    const lines = basketCurrencies.map((c) => {
      const val = (basketAmount * c.rate).toLocaleString('en-US', {
        maximumFractionDigits: c.rate > 100 ? 0 : 2,
      });
      return `${c.code}: ${c.symbol}${val} (Rate: ${c.rate})`;
    });

    const text = `SingaRate Conversion for SGD ${basketAmount.toLocaleString()}:\n` + lines.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="basket" className="py-8 bg-slate-100/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-red-600 mb-1">PORTFOLIO & TRAVEL BASKET</div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Multi-Currency Watchlist Basket
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Convert an SGD budget simultaneously across your pinned currencies. Star currencies below to add them to this basket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Basket Rates'}</span>
            </button>
          </div>
        </div>

        {/* Amount Controller */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <FlagIcon code="SG" className="w-5 h-3.5" />
                <span className="text-xs font-bold text-slate-800">SGD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">S$</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={basketAmount || ''}
                  onChange={(e) => setBasketAmount(Number(e.target.value) || 0)}
                  className="w-32 sm:w-44 text-lg font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-red-500 tabular-nums"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[500, 1000, 2000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBasketAmount(amt)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer transition-colors ${
                    basketAmount === amt
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Currency Basket Cards */}
        {basketCurrencies.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <Star className="w-8 h-8 mx-auto text-amber-400 mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">Your Watchlist is empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click the star icon next to any currency in the table above to track it here in your multi-currency basket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {basketCurrencies.map((c) => {
              const convertedVal = basketAmount * c.rate;
              const formattedVal = convertedVal.toLocaleString('en-US', {
                maximumFractionDigits: c.rate > 100 ? 0 : 2,
              });

              return (
                <div
                  key={c.code}
                  onClick={() => onOpenDetails(c)}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <FlagIcon code={c.flagCode} className="w-6 h-4" />
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                          {c.code}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{c.name}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(c.code);
                      }}
                      className="p-1 text-amber-500 hover:text-amber-600 cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  <div className="my-2">
                    <div className="text-xs text-slate-400 font-medium">Yield for {basketAmount.toLocaleString()} SGD</div>
                    <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                      <span className="text-xs text-slate-400 font-normal mr-1">{c.symbol}</span>
                      {formattedVal}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono tabular-nums">1 SGD = {c.rate}</span>
                    <span
                      className={`font-mono font-medium ${
                        c.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {c.change24h >= 0 ? '+' : ''}
                      {c.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
