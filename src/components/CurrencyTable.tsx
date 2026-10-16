import React, { useState, useMemo } from 'react';
import { Search, Star, ArrowUpDown, TrendingUp, TrendingDown, Calculator, BarChart3, Filter } from 'lucide-react';
import { Currency, CurrencyCategory } from '../types/currency';
import { FlagIcon } from './FlagIcon';

interface CurrencyTableProps {
  currencies: Currency[];
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  onSelectForCalculator: (code: string) => void;
  onOpenDetails: (currency: Currency) => void;
}

type SortField = 'code' | 'name' | 'rate' | 'change24h';
type SortOrder = 'asc' | 'desc';

export const CurrencyTable: React.FC<CurrencyTableProps> = ({
  currencies,
  favorites,
  onToggleFavorite,
  onSelectForCalculator,
  onOpenDetails,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CurrencyCategory>('All');
  const [quoteMode, setQuoteMode] = useState<'SGD_BASE' | 'FOREIGN_BASE'>('SGD_BASE');
  const [sortField, setSortField] = useState<SortField>('rate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filtered and Sorted list
  const processedCurrencies = useMemo(() => {
    let list = [...currencies];

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory === 'Favorites') {
      list = list.filter((c) => favorites.includes(c.code));
    } else if (selectedCategory === 'ASEAN') {
      list = list.filter((c) => c.category === 'ASEAN');
    } else if (selectedCategory === 'Major') {
      list = list.filter((c) => c.category === 'Major');
    } else if (selectedCategory === 'Asia Pacific') {
      list = list.filter((c) => c.category === 'Asia Pacific');
    } else if (selectedCategory === 'Europe') {
      list = list.filter((c) => c.category === 'Europe');
    } else if (selectedCategory === 'Americas') {
      list = list.filter((c) => c.category === 'Americas');
    } else if (selectedCategory === 'Middle East') {
      list = list.filter((c) => c.category === 'Middle East');
    }

    // Sorting
    list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortField === 'code') {
        valA = a.code;
        valB = b.code;
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'name') {
        valA = a.name;
        valB = b.name;
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'rate') {
        valA = quoteMode === 'SGD_BASE' ? a.rate : a.inverseRate;
        valB = quoteMode === 'SGD_BASE' ? b.rate : b.inverseRate;
      } else if (sortField === 'change24h') {
        valA = a.change24h;
        valB = b.change24h;
      }

      return sortOrder === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });

    return list;
  }, [currencies, search, selectedCategory, sortField, sortOrder, quoteMode, favorites]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'change24h' || field === 'rate' ? 'desc' : 'asc');
    }
  };

  // Sparkline renderer for 7D trend
  const renderSparkline = (points: { rate: number }[], change24h: number) => {
    if (!points || points.length < 2) return null;
    const rates = points.map((p) => p.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const pathData = rates
      .map((r, i) => {
        const x = (i / (rates.length - 1)) * width;
        const y = height - ((r - min) / range) * (height - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = change24h >= 0 ? '#16A34A' : '#DC2626';

    return (
      <svg className="w-20 h-6 shrink-0" viewBox={`0 0 ${width} ${height}`}>
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <section id="rates" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-red-600 mb-1">SINGAPORE DOLLAR BENCHMARKS</div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Live Currency Exchange Rates
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Quoted against 1 SGD or standard MAS 100-unit quotations. Click any currency to view trends.
            </p>
          </div>

          {/* Quoting Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg self-start md:self-auto">
            <button
              type="button"
              onClick={() => setQuoteMode('SGD_BASE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                quoteMode === 'SGD_BASE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1 SGD = Target
            </button>
            <button
              type="button"
              onClick={() => setQuoteMode('FOREIGN_BASE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                quoteMode === 'FOREIGN_BASE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Target = SGD (MAS Style)
            </button>
          </div>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code (e.g. USD, MYR, JPY), country, or currency name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {(
                [
                  { id: 'All', label: 'All' },
                  { id: 'Favorites', label: `Watchlist (${favorites.length})` },
                  { id: 'ASEAN', label: 'ASEAN' },
                  { id: 'Major', label: 'Major G10' },
                  { id: 'Asia Pacific', label: 'Asia Pacific' },
                  { id: 'Europe', label: 'Europe' },
                ] as { id: CurrencyCategory; label: string }[]
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Currency Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="w-10 px-4 py-3 text-center">
                    <Star className="w-3.5 h-3.5 mx-auto text-slate-400" />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleSort('code')}
                      className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>Currency</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('rate')}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>{quoteMode === 'SGD_BASE' ? 'Rate (1 SGD)' : 'MAS Indicative'}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('change24h')}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                    >
                      <span>24h Change</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-right">
                    <span>24h Range (Low - High)</span>
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-center">
                    <span>7D Trend</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {processedCurrencies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="max-w-xs mx-auto">
                        <Filter className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm font-medium text-slate-800">No currencies match your filter</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Try adjusting your search query or reset the category filter.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('');
                            setSelectedCategory('All');
                          }}
                          className="mt-3 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  processedCurrencies.map((c) => {
                    const isFav = favorites.includes(c.code);
                    const isPositive = c.change24h >= 0;

                    let displayRate = c.rate;
                    let displayLabel = `1 SGD = ${c.rate} ${c.code}`;

                    if (quoteMode === 'FOREIGN_BASE') {
                      displayRate = c.inverseRate;
                      if (c.masPerHundred) {
                        displayLabel = `100 ${c.code} = ${c.inverseRate} SGD`;
                      } else {
                        displayLabel = `1 ${c.code} = ${c.inverseRate} SGD`;
                      }
                    }

                    return (
                      <tr
                        key={c.code}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => onOpenDetails(c)}
                      >
                        {/* Favorite star */}
                        <td
                          className="px-4 py-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(c.code);
                          }}
                        >
                          <button
                            type="button"
                            className="p-1 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
                            aria-label={`Toggle favorite for ${c.code}`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-slate-400'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Currency Code & Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <FlagIcon code={c.flagCode} className="w-6 h-4" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{c.code}</span>
                                {c.sneerRelevant && (
                                  <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
                                    · S$NEER Basket
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-none">
                                {c.name} · <span className="text-slate-400">{c.country}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Rate */}
                        <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                          <div className="font-bold text-slate-900 text-sm sm:text-base">
                            {quoteMode === 'SGD_BASE'
                              ? c.rate > 1000
                                ? c.rate.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                : c.rate.toFixed(c.rate > 10 ? 2 : 4)
                              : c.inverseRate.toFixed(4)}
                          </div>
                          <div className="text-[10px] text-slate-400">{displayLabel}</div>
                        </td>

                        {/* 24h Change */}
                        <td className="px-4 py-3.5 text-right">
                          <div
                            className={`inline-flex items-center gap-1 font-mono text-xs font-semibold tabular-nums ${
                              isPositive ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>
                              {isPositive ? '+' : ''}
                              {c.change24h.toFixed(2)}%
                            </span>
                          </div>
                        </td>

                        {/* 24h Range */}
                        <td className="hidden sm:table-cell px-4 py-3.5 text-right font-mono text-xs text-slate-600 tabular-nums">
                          <div>
                            <span className="text-slate-400">L:</span> {c.low24h > 100 ? c.low24h.toFixed(0) : c.low24h.toFixed(2)}
                          </div>
                          <div>
                            <span className="text-slate-400">H:</span> {c.high24h > 100 ? c.high24h.toFixed(0) : c.high24h.toFixed(2)}
                          </div>
                        </td>

                        {/* 7D Sparkline */}
                        <td className="hidden md:table-cell px-4 py-3.5 text-center">
                          <div className="flex justify-center">
                            {renderSparkline(c.historicalData['7D'], c.change24h)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-4 py-3.5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onSelectForCalculator(c.code)}
                              title="Load into SGD Calculator"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                            >
                              <Calculator className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenDetails(c)}
                              title="View Chart"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              Showing <span className="font-semibold text-slate-800">{processedCurrencies.length}</span> of{' '}
              {currencies.length} currencies
            </div>
            <div className="text-[11px] text-slate-400">
              Rates updated daily at 16:30 Singapore Time (SGT)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
