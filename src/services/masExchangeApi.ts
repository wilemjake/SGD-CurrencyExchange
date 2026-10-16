import { Currency, MasApiConfig } from '../types/currency';
import { INITIAL_CURRENCIES } from '../data/currencies';

const CONFIG_STORAGE_KEY = 'singarate_mas_config_v1';
const FAVORITES_STORAGE_KEY = 'singarate_favorites_v1';

export const DEFAULT_MAS_CONFIG: MasApiConfig = {
  apiKey: '',
  apiEndpoint: 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=22731872-466f-45a7-96a9-0639d6ff5141',
  isCustomEndpoint: false,
  refreshIntervalSeconds: 60,
  lastSyncTime: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' SGT',
  status: 'mock-active',
  autoRefresh: true,
};

export class MasExchangeService {
  private static config: MasApiConfig = this.loadConfig();

  public static loadConfig(): MasApiConfig {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_MAS_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_MAS_CONFIG;
  }

  public static saveConfig(newConfig: MasApiConfig): void {
    this.config = newConfig;
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save MAS API config', e);
    }
  }

  public static getConfig(): MasApiConfig {
    return this.config;
  }

  public static loadFavorites(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return ['USD', 'MYR', 'JPY', 'THB', 'EUR', 'CNY', 'AUD', 'IDR'];
  }

  public static saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }

  /**
   * Fetches latest rates.
   * If user configured a custom backend or MAS API key, tries that.
   * Otherwise returns realistic simulated live MAS quotes with micro-fluctuations.
   */
  public static async fetchLatestRates(existingCurrencies: Currency[] = INITIAL_CURRENCIES): Promise<{
    currencies: Currency[];
    source: 'MAS_LIVE_API' | 'SIMULATED_BENCHMARK';
    timestamp: string;
  }> {
    const timeStr = new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' SGT';

    // If user provided a backend proxy or MAS direct key
    if (this.config.apiKey.trim() || this.config.isCustomEndpoint) {
      try {
        const targetUrl = this.config.apiEndpoint;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (this.config.apiKey) {
          headers['X-MAS-API-KEY'] = this.config.apiKey;
        }

        const res = await fetch(targetUrl, {
          method: 'GET',
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          // If MAS datastore format is returned
          if (data?.result?.records && Array.isArray(data.result.records)) {
            const updated = this.mapMasRecordsToCurrencies(data.result.records, existingCurrencies);
            this.config.lastSyncTime = timeStr;
            this.config.status = 'connected';
            this.saveConfig(this.config);
            return {
              currencies: updated,
              source: 'MAS_LIVE_API',
              timestamp: timeStr,
            };
          }
        }
      } catch (err) {
        console.warn('Real MAS API fetch failed or CORS restricted in client-only mode, falling back to realistic simulated rates:', err);
      }
    }

    // Client-side realistic real-time simulation:
    // Apply realistic micro-fluctuations (0.01% - 0.08%) to simulate live FX market ticks
    const updated = existingCurrencies.map((c) => {
      // Simulate small market ticks
      const deltaPercent = (Math.random() - 0.49) * 0.0012; // ~0.06% tick
      const newRate = Number((c.rate * (1 + deltaPercent)).toFixed(c.rate > 100 ? 2 : c.rate > 10 ? 3 : 4));
      
      let newInverse = Number((1 / newRate).toFixed(4));
      if (c.masPerHundred) {
        newInverse = Number(((1 / newRate) * 100).toFixed(4));
      }

      const newChange = Number((c.change24h + deltaPercent * 10).toFixed(2));
      const newHigh = Math.max(c.high24h, newRate);
      const newLow = Math.min(c.low24h, newRate);

      return {
        ...c,
        rate: newRate,
        inverseRate: newInverse,
        change24h: newChange,
        high24h: newHigh,
        low24h: newLow,
        lastUpdated: `Today at ${timeStr} (MAS Indicative)`,
      };
    });

    this.config.lastSyncTime = timeStr;
    this.config.status = 'mock-active';
    this.saveConfig(this.config);

    return {
      currencies: updated,
      source: 'SIMULATED_BENCHMARK',
      timestamp: timeStr,
    };
  }

  /**
   * Helper to map official MAS Datastore records to application currency model
   */
  private static mapMasRecordsToCurrencies(records: Record<string, unknown>[], template: Currency[]): Currency[] {
    const latestRecord = records[records.length - 1] || {};
    
    return template.map((curr) => {
      // MAS format: e.g. usd_sgd, myr_sgd_100, eur_sgd, jpy_sgd_100
      const standardKey = `${curr.code.toLowerCase()}_sgd`;
      const hundredKey = `${curr.code.toLowerCase()}_sgd_100`;

      let rawVal = latestRecord[standardKey] || latestRecord[hundredKey];
      if (!rawVal && latestRecord[`sgd_${curr.code.toLowerCase()}`]) {
        rawVal = latestRecord[`sgd_${curr.code.toLowerCase()}`];
      }

      if (rawVal && !isNaN(Number(rawVal))) {
        const val = Number(rawVal);
        let ratePerSgd = 1 / val;
        let inverse = val;

        if (curr.masPerHundred) {
          // If MAS quoted 100 foreign per SGD or SGD per 100 foreign
          ratePerSgd = 100 / val;
          inverse = val;
        }

        return {
          ...curr,
          rate: Number(ratePerSgd.toFixed(curr.rate > 100 ? 2 : curr.rate > 10 ? 3 : 4)),
          inverseRate: Number(inverse.toFixed(4)),
          lastUpdated: 'Live from MAS Official Record',
        };
      }

      return curr;
    });
  }

  /**
   * Diagnostic connection tester
   */
  public static async testConnection(endpoint: string, apiKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const headers: Record<string, string> = {};
      if (apiKey) {
        headers['X-MAS-API-KEY'] = apiKey;
      }
      
      const res = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        return {
          success: true,
          message: 'Connection successful! MAS API endpoint responded with 200 OK.',
        };
      } else {
        return {
          success: false,
          message: `Endpoint returned HTTP status ${res.status}: ${res.statusText}`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error or CORS restriction on direct browser call.';
      return {
        success: false,
        message: `Direct browser call blocked (${msg}). We recommend routing through an Express /api proxy when deploying your backend key!`,
      };
    }
  }
}
