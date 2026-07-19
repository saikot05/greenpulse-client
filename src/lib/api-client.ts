import { getApiBaseUrl } from './urls';

const BASE_URL = getApiBaseUrl();

// ─── JWT Token Cache ─────────────────────────────────────────────────────────
let _cachedJwt: string | null = null;
let _jwtExpiry = 0;

/**
 * Retrieves a valid auth token for cross-origin API requests.
 *
 * 1. Tries reading the session cookie directly (fast path — works in dev
 *    where the cookie is NOT HttpOnly).
 * 2. Falls back to Better Auth's JWT token endpoint `/api/auth/token`
 *    (works in production where cookies are HttpOnly + Secure).
 *    This is a same-origin request, so the browser sends the HttpOnly cookie
 *    automatically.
 * 3. Caches the JWT for 4 minutes to avoid re-fetching on every request
 *    (Better Auth JWTs default to 5 min expiry).
 */
async function getSessionToken(): Promise<string> {
  if (typeof window === 'undefined') return '';

  // Fast path: try reading cookie directly (works in dev)
  const match = document.cookie.match(
    /(?:^|; )(?:__Secure-)?better-auth\.session_token=([^;]*)/
  );
  if (match) return decodeURIComponent(match[1]);

  // Return cached JWT if still valid
  if (_cachedJwt && Date.now() < _jwtExpiry) return _cachedJwt;

  // Fetch JWT from Better Auth's token endpoint (same-origin, HttpOnly cookies are sent)
  try {
    const res = await fetch('/api/auth/token', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        _cachedJwt = data.token;
        _jwtExpiry = Date.now() + 4 * 60 * 1000; // cache for 4 min
        return data.token;
      }
    }
  } catch {
    // User is not authenticated — silently return empty
  }

  return '';
}


/**
 * Enterprise Fetch API Wrapper.
 * Integrates error serialization, credentials inclusion, and automatic header adjustments.
 */
export const apiClient = {
  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const token = await getSessionToken();
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      // Essential: send session cookies cross-origin (e.g. port 3000 to port 5000)
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP Error ${response.status}: Failed to fetch`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const token = await getSessionToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      // Essential: send session cookies cross-origin (e.g. port 3000 to port 5000)
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP Error ${response.status}: Failed to post`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },

  async delete<T>(path: string): Promise<T> {
    const token = await getSessionToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP Error ${response.status}: Failed to delete`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const token = await getSessionToken();
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      // Let the browser set the boundary headers automatically
      body: formData,
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      // Essential: send session cookies cross-origin (e.g. port 3000 to port 5000)
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP Error ${response.status}: Failed to upload`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  },
};

// ─── API endpoints wrapping ──────────────────────────────────────────────────

export interface IEsgAuditInput {
  title: string;
  facilityName: string;
  facilityType: string;
  location: string;
  auditYear: number;
  scopeCategory: string;
  carbonScoreTons: number;
  energyUsageKwh: number;
  riskRating: string;
  shortDescription: string;
  fullOverview: string;
  imageUrl?: string;
  tags?: string[];
}

export interface IParsedBillResponse {
  facilityName: string;
  facilityType: 'Manufacturing' | 'Data Center' | 'Corporate Office' | 'Logistics Hub' | 'Retail Store';
  energyUsageKwh: number;
  estimatedCarbonTons: number;
  scopeCategory: 'Scope 1 (Direct)' | 'Scope 2 (Indirect Energy)' | 'Scope 3 (Value Chain)';
  riskRating: 'Low Carbon' | 'Moderate Impact' | 'High Emissions' | 'Critical Failure';
  shortDescription: string;
  fullOverview: string;
}

/**
 * Uploads a utility bill invoice file to parse it via Gemini AI.
 */
export async function parseUtilityBill(file: File): Promise<IParsedBillResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.postFormData<any>(
    '/ai/parse-bill',
    formData
  );
  return res?.data || res;
}

/**
 * Creates a new ESG audit.
 */
export async function createAudit(data: IEsgAuditInput): Promise<unknown> {
  return apiClient.post('/audits', data);
}

/**
 * Fetches all audits (filtered & paginated).
 */
export async function getAudits(params?: Record<string, string | number | undefined>): Promise<any> {
  const res = await apiClient.get<{ status: string; data: any }>('/audits', params);
  return res.data;
}

/**
 * Fetches a single ESG audit by ID.
 */
export async function getAudit(id: string): Promise<any> {
  const res = await apiClient.get<{ status: string; data: any }>(`/audits/${id}`);
  return res.data;
}

/**
 * Deletes an ESG audit by ID.
 */
export async function deleteAudit(id: string): Promise<any> {
  return apiClient.delete<{ status: string; message: string }>(`/audits/${id}`);
}

/**
 * Sends a chat message to the sustainability copilot.
 */
export async function sendChatMessage(sessionId: string, message: string): Promise<string> {
  const res = await apiClient.post<{ status: string; data: string }>('/ai/chat', {
    sessionId,
    message,
  });
  return res.data;
}

/**
 * Uploads a telemetry CSV or JSON file to analyze carbon footprint.
 */
export async function analyzeTelemetryFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.postFormData<{ status: string; data: any }>(
    '/ai/analyze-data',
    formData
  );
  return res.data;
}

export async function analyzeCarbonData(data: any[]): Promise<any> {
  const res = await apiClient.post<{ success: boolean; data: any }>('/carbon/analyze', { data });
  return res.data;
}

export async function askSupportAgent(messages: Array<{ role: string; content: string }>): Promise<{ text: string }> {
  const res = await apiClient.post<{ status: string; data: { text: string } }>('/ai/chat', {
    messages,
    stream: false,
  });
  return res.data;
}

export async function analyzeTelemetryTelemetry(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.postFormData<{ status: string; data: any }>(
    '/ai/analyze-telemetry',
    formData
  );
  return res.data;
}

export default apiClient;
