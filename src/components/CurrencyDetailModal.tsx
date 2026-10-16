import React, { useState, useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Star, Calendar, Calculator, Info } from 'lucide-react';
import { Currency } from '../types/currency';
import { FlagIcon } from './FlagIcon';

interface CurrencyDetailModalProps {
  currency: Currency | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (code: string) => void;
  onSelectForCalculator: (code: string) => void;
}

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export const CurrencyDetailModal: React.FC<CurrencyDetailModalProps> = ({
  currency,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectForCalculator,
}) => {
  const [range, setRange] = useState<TimeRange>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; rate: number } | null>(null);
  const [calcInput, setCalcInput] = useState<number>(100);

  if (!isOpen || !currency) return null;

  const points = currency.historicalData[range] || [];

  // Metrics for current range
  const { minRate, maxRate, avgRate, changeSinceStart } = useMemo(() => {
    if (!points.length) return { minRate: 0, maxRate: 0, avgRate: 0, changeSinceStart: 0 };
    const rates = points.map((p) => p.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const start = rates[0];
    const end = rates[rates.length - 1];
    const change = ((end - start) / start) * 100;
    return { minRate: min, maxRate: max, avgRate: avg, changeSinceStart: change };
  }, [points]);

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 55 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const rateRange = maxRate - minRate || 1;

  const pathCoordinates = points.map((p, index) => {
    const x = padding.left + (index / (points.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - ((p.rate - minRate) / rateRange) * innerHeight;
    return { x, y, point: p };
  });

  const linePath = pathCoordinates
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${padding.left + innerWidth},${padding.top + innerHeight} L ${padding.left},${
    padding.top + innerHeight
  } Z`;

  const isPositive = changeSinceStart >= 0;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <FlagIcon code={currency.flagCode} className="w-9 h-6" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{currency.code}</h3>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-sm font-medium text-slate-700">{currency.name}</span>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(currency.code)}
                  className="p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Toggle favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-slate-400'
                    }`}
                  />
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currency.country} · {currency.category} Region
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Rates Highlight Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">1 SGD Rate</div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {currency.rate > 1000 ? currency.rate.toFixed(0) : currency.rate.toFixed(currency.rate > 10 ? 2 : 4)}
              </div>
              <div className="text-[10px] text-slate-400">{currency.code}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">
                {currency.masPerHundred ? '100 Units Quote' : '1 Unit in SGD'}
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {currency.inverseRate.toFixed(4)}
              </div>
              <div className="text-[10px] text-slate-400">SGD (MAS Indicative)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">24h Change</div>
              <div
                className={`text-lg font-bold font-mono tabular-nums mt-0.5 flex items-center gap-1 ${
                  currency.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {currency.change24h >= 0 ? '+' : ''}
                {currency.change24h.toFixed(2)}%
              </div>
              <div className="text-[10px] text-slate-400">Daily delta</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-medium text-slate-500">Period Trend</div>
              <div
                className={`text-lg font-bold font-mono tabular-nums mt-0.5 ${
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {changeSinceStart.toFixed(2)}%
              </div>
              <div className="text-[10px] text-slate-400">In past {range}</div>
            </div>
          </div>

          {/* Interactive Historical Chart */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-900">Exchange Rate History (SGD / {currency.code})</span>
                {hoveredPoint && (
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    {hoveredPoint.date}: <strong>{hoveredPoint.rate}</strong>
                  </span>
                )}
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
                {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setRange(t);
                      setHoveredPoint(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      range === t ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-48 select-none"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Y-axis guideline marks */}
                <line
                  x1={padding.left}
                  y1={padding.top}
                  x2={padding.left + innerWidth}
                  y2={padding.top}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={padding.top + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {maxRate.toFixed(maxRate > 10 ? 2 : 4)}
                </text>

                <line
                  x1={padding.left}
                  y1={padding.top + innerHeight / 2}
                  x2={padding.left + innerWidth}
                  y2={padding.top + innerHeight / 2}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={padding.top + innerHeight / 2 + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {avgRate.toFixed(avgRate > 10 ? 2 : 4)}
                </text>

                <line
                  x1={padding.left}
                  y1={padding.top + innerHeight}
                  x2={padding.left + innerWidth}
                  y2={padding.top + innerHeight}
                  stroke="#E2E8F0"
                />
                <text
                  x={padding.left - 8}
                  y={padding.top + innerHeight + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {minRate.toFixed(minRate > 10 ? 2 : 4)}
                </text>

                {/* Gradient area */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#16A34A' : '#DC2626'} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={isPositive ? '#16A34A' : '#DC2626'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Line Path */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={isPositive ? '#16A34A' : '#DC2626'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points and Hover Areas */}
                {pathCoordinates.map((c, i) => (
                  <g key={i}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={hoveredPoint?.date === c.point.date ? 5 : 2}
                      className={
                        hoveredPoint?.date === c.point.date
                          ? 'fill-white stroke-2 stroke-slate-900'
                          : isPositive
                          ? 'fill-emerald-600'
                          : 'fill-rose-600'
                      }
                    />
                    {/* Invisible larger hover target */}
                    <rect
                      x={c.x - 8}
                      y={padding.top}
                      width={16}
                      height={innerHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(c.point)}
                    />
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
              <span>{points[0]?.date}</span>
              <span>Range: {minRate.toFixed(2)} - {maxRate.toFixed(2)}</span>
              <span>{points[points.length - 1]?.date} (Latest)</span>
            </div>
          </div>

          {/* Quick Calculator for this Currency */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-slate-500" />
              <span>Quick Conversion Test</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-600">SGD</span>
                <input
                  type="number"
                  min="1"
                  value={calcInput || ''}
                  onChange={(e) => setCalcInput(Number(e.target.value) || 0)}
                  className="w-full sm:w-32 px-3 py-1.5 text-sm font-bold bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-red-500 tabular-nums"
                />
              </div>
              <span className="text-slate-400 font-bold hidden sm:inline">&rarr;</span>
              <div className="flex items-center gap-2 w-full sm:flex-1 p-2 bg-white rounded-lg border border-slate-200">
                <FlagIcon code={currency.flagCode} className="w-5 h-3.5" />
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {(calcInput * currency.rate).toLocaleString('en-US', {
                    maximumFractionDigits: currency.rate > 100 ? 0 : 2,
                  })}{' '}
                  {currency.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectForCalculator(currency.code);
                  onClose();
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Open in Full Calculator
              </button>
            </div>
          </div>

          {/* MAS Regulatory Note */}
          <div className="text-xs text-slate-500 flex items-start gap-2 bg-blue-50/60 p-3 rounded-lg border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {currency.description || `${currency.name} is quoted as part of Singapore's regional foreign exchange monitor.`}
              {currency.masPerHundred && ' Quoted under standard MAS per-100 units benchmark convention.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
