import type { Request, Response } from 'express';

const MAS_BASE_URL =
  'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily';

/**
 * Serverless API handler to fetch live exchange rates from the MAS API Catalogue
 * Route: GET /api/exchangerates
 *
 * Query Params:
 * - end_of_day: e.g. "2026-10-14" (optional, defaults to latest Singapore business date)
 *
 * Headers:
 * - KeyId: <MAS_KEY_ID> (optional in request if MAS_KEY_ID is set in process.env)
 */
export default async function handler(req: Request, res: Response) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, KeyId, x-mas-key-id, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Resolve MAS KeyId strictly without hardcoding
    const headerKeyId = (req.headers['keyid'] || req.headers['x-mas-key-id']) as string | undefined;
    const queryKeyId = req.query.key_id as string | undefined;
    const masKeyId = (process.env.MAS_KEY_ID || headerKeyId || queryKeyId || '').trim();

    // 2. Resolve end_of_day date parameter
    let endOfDay = (req.query.end_of_day as string) || '';
    if (!endOfDay) {
      // Default to yesterday or today's date formatted in SGT YYYY-MM-DD
      const now = new Date();
      const sgtDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now);
      endOfDay = sgtDateStr;
    }

    // 3. Check if KeyId is configured
    if (!masKeyId) {
      return res.status(200).json({
        success: false,
        status: 'pending_configuration',
        message:
          'MAS_KEY_ID is not configured in process.env or request headers. Please add MAS_KEY_ID to your environment variables or pass KeyId header.',
        targetEndpoint: `${MAS_BASE_URL}?end_of_day=${encodeURIComponent(endOfDay)}`,
        requiredHeader: 'KeyId: <YOUR_MAS_KEY_ID>',
        endOfDay,
        timestamp: new Date().toISOString(),
      });
    }

    // 4. Construct live MAS API Catalogue URL
    const targetUrl = new URL(MAS_BASE_URL);
    targetUrl.searchParams.set('end_of_day', endOfDay);

    // 5. Execute external fetch to MAS API Gateway
    const masResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        KeyId: masKeyId,
        Accept: 'application/json',
        'User-Agent': 'SingaRate-MAS-Client/1.0',
      },
    });

    const contentType = masResponse.headers.get('content-type') || '';
    let responseData: any = null;

    if (contentType.includes('application/json')) {
      responseData = await masResponse.json();
    } else {
      const text = await masResponse.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { rawResponse: text };
      }
    }

    if (!masResponse.ok) {
      return res.status(masResponse.status).json({
        success: false,
        status: 'mas_api_error',
        statusCode: masResponse.status,
        statusText: masResponse.statusText,
        message: 'The MAS API Catalogue returned an error response.',
        details: responseData,
        queriedUrl: targetUrl.toString(),
        endOfDay,
      });
    }

    // 6. Return successful MAS data payload
    return res.status(200).json({
      success: true,
      status: 'ok',
      source: 'MAS_API_CATALOGUE',
      endOfDay,
      data: responseData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error connecting to MAS API:', error);
    return res.status(500).json({
      success: false,
      status: 'internal_error',
      message: error?.message || 'Failed to connect to the MAS API Gateway',
      timestamp: new Date().toISOString(),
    });
  }
}
