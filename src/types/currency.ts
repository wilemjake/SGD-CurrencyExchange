export type CurrencyCategory = 'All' | 'Favorites' | 'ASEAN' | 'Major' | 'Asia Pacific' | 'Europe' | 'Americas' | 'Middle East';

export interface HistoricalPoint {
  date: string;
  rate: number;
}

export interface Currency {
  code: string;
  name: string;
  country: string;
  symbol: string;
  flagCode: string; // ISO 2-letter country code or flag ID
  rate: number; // 1 SGD = X target currency
  inverseRate: number; // 1 target currency = X SGD
  masPerHundred: boolean; // MAS standard quote convention (e.g., JPY per 100)
  change24h: number; // Percentage change in 24h
  high24h: number;
  low24h: number;
  category: 'ASEAN' | 'Major' | 'Asia Pacific' | 'Europe' | 'Americas' | 'Middle East';
  historicalData: {
    '7D': HistoricalPoint[];
    '30D': HistoricalPoint[];
    '90D': HistoricalPoint[];
    '1Y': HistoricalPoint[];
  };
  lastUpdated: string;
  sneerRelevant?: boolean; // Singapore S$NEER policy basket relevance
  description?: string;
}

export interface ConversionRecord {
  id: string;
  timestamp: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
}

export interface MasApiConfig {
  apiKey: string;
  apiEndpoint: string;
  isCustomEndpoint: boolean;
  refreshIntervalSeconds: number;
  lastSyncTime: string | null;
  status: 'idle' | 'connected' | 'mock-active' | 'error';
  autoRefresh: boolean;
}
