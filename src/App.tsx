/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroCalculator } from './components/HeroCalculator';
import { CurrencyTable } from './components/CurrencyTable';
import { QuickBasketConverter } from './components/QuickBasketConverter';
import { CurrencyDetailModal } from './components/CurrencyDetailModal';
import { MasApiConfigModal } from './components/MasApiConfigModal';
import { MasInfoSection } from './components/MasInfoSection';
import { Footer } from './components/Footer';

import { Currency, MasApiConfig } from './types/currency';
import { INITIAL_CURRENCIES } from './data/currencies';
import { MasExchangeService } from './services/masExchangeApi';

export default function App() {
  const [currencies, setCurrencies] = useState<Currency[]>(INITIAL_CURRENCIES);
  const [favorites, setFavorites] = useState<string[]>(() => MasExchangeService.loadFavorites());
  const [selectedCalcCode, setSelectedCalcCode] = useState<string>('MYR');
  const [detailCurrency, setDetailCurrency] = useState<Currency | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [config, setConfig] = useState<MasApiConfig>(() => MasExchangeService.loadConfig());
  const [lastSyncNotice, setLastSyncNotice] = useState<string>('Sync active');

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await MasExchangeService.fetchLatestRates(currencies);
      setCurrencies(res.currencies);
      setLastSyncNotice(res.timestamp);
      setConfig(MasExchangeService.getConfig());
    } catch (err) {
      console.error('Refresh error', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [currencies]);

  // Periodic auto-refresh
  useEffect(() => {
    if (!config.autoRefresh) return;
    const intervalMs = (config.refreshIntervalSeconds || 60) * 1000;
    const timer = setInterval(() => {
      handleRefresh();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [config.autoRefresh, config.refreshIntervalSeconds, handleRefresh]);

  // Toggle favorite
  const handleToggleFavorite = (code: string) => {
    setFavorites((prev) => {
      let next: string[];
      if (prev.includes(code)) {
        next = prev.filter((c) => c !== code);
      } else {
        next = [...prev, code];
      }
      MasExchangeService.saveFavorites(next);
      return next;
    });
  };

  // Smooth scroll
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveConfig = (newConfig: MasApiConfig) => {
    setConfig(newConfig);
    MasExchangeService.saveConfig(newConfig);
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-body">
      {/* Top Bar */}
      <Header
        config={config}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenConfig={() => setIsConfigOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* SGD Currency Calculator & Singapore Channels Comparison */}
        <HeroCalculator
          currencies={currencies}
          selectedCode={selectedCalcCode}
          onSelectCurrency={(code) => setSelectedCalcCode(code)}
          onOpenDetails={(curr) => setDetailCurrency(curr)}
        />

        {/* Multi-Currency Watchlist Basket */}
        <QuickBasketConverter
          currencies={currencies}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenDetails={(curr) => setDetailCurrency(curr)}
        />

        {/* Comprehensive Live Currency Rates Table */}
        <CurrencyTable
          currencies={currencies}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectForCalculator={(code) => {
            setSelectedCalcCode(code);
            handleNavigateSection('calculator');
          }}
          onOpenDetails={(curr) => setDetailCurrency(curr)}
        />

        {/* MAS Monetary Authority of Singapore Context Section */}
        <MasInfoSection />
      </main>

      {/* Detail & Historical Trend Modal */}
      <CurrencyDetailModal
        currency={detailCurrency}
        isOpen={Boolean(detailCurrency)}
        onClose={() => setDetailCurrency(null)}
        isFavorite={detailCurrency ? favorites.includes(detailCurrency.code) : false}
        onToggleFavorite={handleToggleFavorite}
        onSelectForCalculator={(code) => {
          setSelectedCalcCode(code);
          handleNavigateSection('calculator');
        }}
      />

      {/* Developer & MAS API Config Modal */}
      <MasApiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Compliant Footer */}
      <Footer />
    </div>
  );
}
