import React, { useState } from 'react';
import { X, Check, Key, Server, Terminal, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [endpoint, setEndpoint] = useState(config.apiEndpoint);
  const [isCustomEndpoint, setIsCustomEndpoint] = useState(config.isCustomEndpoint);
  const [autoRefresh, setAutoRefresh] = useState(config.autoRefresh);
  const [refreshInterval, setRefreshInterval] = useState(config.refreshIntervalSeconds);
  const [activeTab, setActiveTab] = useState<'settings' | 'developer-guide'>('settings');

  const [testStatus, setTestStatus] = useState<{
    running: boolean;
    result: { success: boolean; message: string } | null;
  }>({ running: false, result: null });

  const [savedSuccess, setSavedSuccess] = useState(false);

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
      status: apiKey.trim() ? 'connected' : 'mock-active',
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
    setEndpoint('https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=22731872-466f-45a7-96a9-0639d6ff5141');
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
              <h3 className="text-lg font-bold text-slate-900">MAS API & Backend Integration</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure Monetary Authority of Singapore (MAS) API keys and proxy routing.
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
            Integration Settings
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
            Backend Hookup Guide (Node / Express)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {activeTab === 'settings' ? (
            <>
              {/* Notice banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Current Mode: </span>
                {apiKey ? (
                  <span className="text-emerald-700 font-medium">Configured to query your specified MAS API / endpoint</span>
                ) : (
                  <span className="text-slate-600">
                    Front-end mock benchmark active. You can add your MAS API key or custom backend endpoint whenever you are ready.
                  </span>
                )}
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  MAS API Key (Optional for now)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="e.g. mas_api_live_..."
                    className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Obtained from Singapore Government Developer Portal or Monetary Authority of Singapore API developer accounts.
                </p>
              </div>

              {/* Endpoint URL Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Exchange Rates API Endpoint
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomEndpoint}
                      onChange={(e) => setIsCustomEndpoint(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Custom Backend Proxy URL</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=..."
                  className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Official MAS resource dataset ID for daily exchange rates is pre-filled above.
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
                  <span>{testStatus.running ? 'Testing Connection...' : 'Test API Connection'}</span>
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
          ) : (
            /* Developer Guide Tab */
            <div className="space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                When you are ready to add your backend server integration using your MAS API key, you can add an Express route in 
                <code className="text-red-600 font-mono mx-1">server.ts</code>. This keeps your MAS API key secure and prevents browser CORS limitations:
              </div>

              <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{`// server.ts route example:
app.get('/api/mas-exchange', async (req, res) => {
  try {
    const MAS_API_KEY = process.env.MAS_API_KEY;
    const response = await fetch(
      'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=22731872-466f-45a7-96a9-0639d6ff5141&limit=10',
      {
        headers: {
          'X-MAS-API-KEY': MAS_API_KEY || '',
          'Accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch MAS rates' });
  }
});`}</pre>
              </div>

              <div className="text-xs text-slate-500">
                Then simply toggle <strong>Custom Backend Proxy URL</strong> above to <code className="text-slate-800 font-mono">/api/mas-exchange</code>.
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
