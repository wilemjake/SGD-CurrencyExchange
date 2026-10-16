import { Currency, MasApiConfig } from '../types/currency';
import { INITIAL_CURRENCIES } from '../data/currencies';

const CONFIG_STORAGE_KEY = 'singarate_mas_config_v2';
const FAVORITES_STORAGE_KEY = 'singarate_favorites_v1';

export const DEFAULT_MAS_CONFIG: MasApiConfig = {
  apiKey: '',
  apiEndpoint: '/api/exchangerates',
  isCustomEndpoint: false,
  refreshIntervalSeconds: 60,
  lastSyncTime:
    new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
    ' SGT',
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
   * Check /api/health to see if backend serverless endpoint and MAS_KEY_ID are available
   */
  public static async checkHealth(): Promise<{
    status: string;
    masKeyConfigured: boolean;
    service: string;
    masCatalogueEndpoint?: string;
  }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // serverless endpoint or server offline
    }
    return {
      status: 'offline',
      masKeyConfigured: false,
      service: 'MAS Exchange Rates Serverless API',
    };
  }

  /**
   * Fetches latest rates.
   * Calls the serverless /api/exchangerates endpoint.
   * If MAS_KEY_ID is set in environment or provided via headers, uses live MAS API Catalogue data.
   * Otherwise falls back gracefully to live simulated benchmark quotes with micro-fluctuations.
   */
  public static async fetchLatestRates(existingCurrencies: Currency[] = INITIAL_CURRENCIES): Promise<{
    currencies: Currency[];
    source: 'MAS_LIVE_API' | 'SIMULATED_BENCHMARK';
    timestamp: string;
  }> {
    const timeStr =
      new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
      ' SGT';

    // 1. Try querying the serverless /api/exchangerates endpoint
    try {
      const endpoint = this.config.apiEndpoint || '/api/exchangerates';
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (this.config.apiKey.trim()) {
        headers['KeyId'] = this.config.apiKey.trim();
      }

      const res = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (res.ok) {
        const payload = await res.json();

        // Check if MAS API catalogue responded with live records
        const records =
          payload?.data?.result?.records ||
          payload?.data?.records ||
          (Array.isArray(payload?.data) ? payload.data : null);

        if (payload?.success && records && records.length > 0) {
          const updated = this.mapMasRecordsToCurrencies(records, existingCurrencies);
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
      console.warn('Serverless endpoint fetch error or pending configuration, falling back to simulated benchmark quotes:', err);
    }

    // 2. Realistic benchmark rates with micro-fluctuations (keeps frontend fluid and interactive)
    const updated = existingCurrencies.map((c) => {
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
        lastUpdated: `Today at ${timeStr} (MAS Benchmark)`,
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
   * Maps official MAS Statistical Bulletin & DataStore records to application currency model
   */
  private static mapMasRecordsToCurrencies(records: Record<string, unknown>[], template: Currency[]): Currency[] {
    const latestRecord = records[records.length - 1] || {};

    return template.map((curr) => {
      const c = curr.code.toLowerCase();
      // MAS column formats in statistical bulletin and datastore views:
      // e.g. usd_sgd, myr_sgd, myr_sgd_100, jpy_sgd_100, eur_sgd, gbp_sgd, aud_sgd
      const candidates = [
        `${c}_sgd`,
        `${c}_sgd_100`,
        `sgd_${c}`,
        `sgd_${c}_100`,
        `${c}`,
      ];

      let rawVal: unknown = null;
      for (const key of candidates) {
        if (latestRecord[key] !== undefined && latestRecord[key] !== null && latestRecord[key] !== '') {
          rawVal = latestRecord[key];
          break;
        }
      }

      // Case-insensitive fallback lookup
      if (rawVal === null) {
        for (const [key, val] of Object.entries(latestRecord)) {
          const lowerKey = key.toLowerCase();
          if (
            lowerKey.startsWith(`${c}_sgd`) ||
            lowerKey.startsWith(`sgd_${c}`) ||
            lowerKey === c
          ) {
            rawVal = val;
            break;
          }
        }
      }

      if (rawVal !== null && !isNaN(Number(rawVal))) {
        const val = Number(rawVal);
        let ratePerSgd = 1 / val;
        let inverse = val;

        if (curr.masPerHundred) {
          ratePerSgd = 100 / val;
          inverse = val;
        }

        return {
          ...curr,
          rate: Number(ratePerSgd.toFixed(curr.rate > 100 ? 2 : curr.rate > 10 ? 3 : 4)),
          inverseRate: Number(inverse.toFixed(4)),
          lastUpdated: 'Live from MAS API Catalogue',
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
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (apiKey) {
        headers['KeyId'] = apiKey;
      }

      const res = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (data?.status === 'pending_configuration') {
          return {
            success: false,
            message: data.message || 'Serverless endpoint reached, but MAS_KEY_ID is not configured in environment.',
          };
        }
        return {
          success: true,
          message: 'Connection successful! Received 200 OK from MAS API endpoint.',
        };
      } else {
        return {
          success: false,
          message: `Endpoint returned HTTP status ${res.status}: ${data?.message || res.statusText}`,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return {
        success: false,
        message: `Failed to connect to endpoint (${msg}).`,
      };
    }
  }
}
