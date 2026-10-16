import type { Request, Response } from 'express';

/**
 * Health check endpoint for the MAS serverless integration
 * Route: GET /api/health
 */
export default async function handler(req: Request, res: Response) {
  // CORS configuration for serverless and client calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, KeyId, x-mas-key-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const masKeyConfigured = Boolean(process.env.MAS_KEY_ID && process.env.MAS_KEY_ID.trim() !== '');

  return res.status(200).json({
    status: 'ok',
    service: 'MAS Exchange Rates Serverless API',
    timestamp: new Date().toISOString(),
    masKeyConfigured,
    instructions: masKeyConfigured
      ? 'MAS_KEY_ID is detected in environment variables.'
      : 'MAS_KEY_ID is not yet configured. Please set MAS_KEY_ID in your environment variables or .env file.',
    masCatalogueEndpoint:
      'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily',
    environment: process.env.NODE_ENV || 'development',
  });
}
