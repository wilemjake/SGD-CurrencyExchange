import React, { useState, useEffect } from 'react';
import { X, Check, Key, Server, Terminal, AlertCircle, RefreshCw, Activity } from 'lucide-react';
import { MasApiConfig } from '../types/currency';
import { MasExchangeService } from '../services/masExchangeApi';

interface MasApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MasApiConfig;
  onSaveConfig: (newConfig: MasApiConfig) => void;
}

export const MasApiConfigModal: React.FC<MasApiConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [endpoint, setEndpoint] = useState(config.apiEndpoint || '/api/exchangerates');
  const [isCustomEndpoint, setIsCustomEndpoint] = useState(config.isCustomEndpoint);
  const [autoRefresh, setAutoRefresh] = useState(config.autoRefresh);
  const [refreshInterval, setRefreshInterval] = useState(config.refreshIntervalSeconds);
  const [activeTab, setActiveTab] = useState<'settings' | 'developer-guide' | 'health'>('settings');

  const [healthStatus, setHealthStatus] = useState<{
    loaded: boolean;
    data: any;
  }>({ loaded: false, data: null });

  const [testStatus, setTestStatus] = useState<{
    running: boolean;
    result: { success: boolean; message: string } | null;
  }>({ running: false, result: null });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      MasExchangeService.checkHealth().then((h) => {
        setHealthStatus({ loaded: true, data: h });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ running: true, result: null });
    const res = await MasExchangeService.testConnection(endpoint, apiKey);
    setTestStatus({ running: false, result: res });
  };

  const handleSave = () => {
    const updated: MasApiConfig = {
      ...config,
      apiKey: apiKey.trim(),
      apiEndpoint: endpoint.trim(),
      isCustomEndpoint,
      autoRefresh,
      refreshIntervalSeconds: refreshInterval,
      status: apiKey.trim() || healthStatus.data?.masKeyConfigured ? 'connected' : 'mock-active',
    };
    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setApiKey('');
    setEndpoint('/api/exchangerates');
    setIsCustomEndpoint(false);
    setAutoRefresh(true);
    setRefreshInterval(60);
  };

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
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">MAS Serverless API & KeyId</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connected to <code className="text-red-700 font-mono">/api/exchangerates</code> & <code className="text-red-700 font-mono">/api/health</code>
              </p>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            API Connection
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Health & Diagnostics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('developer-guide')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'developer-guide'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            MAS Catalogue Specs
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {activeTab === 'settings' ? (
            <>
              {/* Health Indicator Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900">MAS KeyId Status: </span>
                  {healthStatus.data?.masKeyConfigured ? (
                    <span className="text-emerald-700 font-semibold">Active in environment (process.env.MAS_KEY_ID)</span>
                  ) : apiKey ? (
                    <span className="text-emerald-700 font-semibold">KeyId provided in client override</span>
                  ) : (
                    <span className="text-amber-700 font-medium">Pending KeyId (Benchmark fallback active)</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('health')}
                  className="text-xs text-red-600 hover:underline font-medium shrink-0"
                >
                  View Details &rarr;
                </button>
              </div>

              {/* Endpoint URL Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Local Serverless Endpoint
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">/api/exchangerates</span>
                </div>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/api/exchangerates"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Pulls live data through <code className="text-slate-700 font-mono">/api/exchangerates.ts</code> from the MAS API Catalogue.
                </p>
              </div>

              {/* Optional Client KeyId Override */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Client KeyId Header (Optional test override)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your MAS KeyId or leave blank to use process.env.MAS_KEY_ID"
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Passed as <code className="text-slate-700 font-mono">KeyId: &lt;MAS_KEY_ID&gt;</code> to the MAS Gateway.
                </p>
              </div>

              {/* Polling & Auto-refresh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Auto-Refresh Interval
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-red-500"
                  >
                    <option value={15}>15 seconds (High frequency)</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds (Recommended)</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="font-medium">Enable automatic live polling</span>
                  </label>
                </div>
              </div>

              {/* Test Connection Button & Result */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus.running}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus.running ? 'animate-spin' : ''}`} />
                  <span>{testStatus.running ? 'Testing /api/exchangerates...' : 'Test Serverless Endpoint'}</span>
                </button>

                {testStatus.result && (
                  <div
                    className={`mt-2.5 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                      testStatus.result.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {testStatus.result.success ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>{testStatus.result.message}</div>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'health' ? (
            /* Health & Diagnostics Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-700">Endpoint Health: /api/health</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    HTTP 200 OK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Serverless Service</span>
                    <span className="font-semibold text-slate-800">MAS Exchange Rates API</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Environment MAS_KEY_ID</span>
                    <span className={`font-semibold ${healthStatus.data?.masKeyConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {healthStatus.data?.masKeyConfigured ? 'Configured' : 'Not set in env'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Target MAS Gateway</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 break-all">
                    https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                To populate your MAS KeyId on your server or hosting environment, set the variable:
                <div className="mt-1 p-2 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg">
                  export MAS_KEY_ID="your-key-id-here"
                </div>
              </div>
            </div>
          ) : (
            /* MAS Catalogue Specs Tab */
            <div className="space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                The serverless function at <code className="text-red-600 font-mono mx-1">/api/exchangerates.ts</code> proxies directly to the official Monetary Authority of Singapore (MAS) API Catalogue:
              </div>

              <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold"># Endpoint requested:</div>
                <div className="text-slate-300">
                  GET https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily?end_of_day=2026-10-14
                </div>
                <div className="text-emerald-400 font-bold mt-2"># Request Header:</div>
                <div className="text-amber-300">
                  KeyId: &lt;MAS_KEY_ID&gt;
                </div>
              </div>

              <div className="text-xs text-slate-500">
                The serverless layer handles CORS, hides your secret KeyId from client browsers, and automatically supplies the latest business date if none is specified in query parameters.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Reset to Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
