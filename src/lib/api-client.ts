const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Reads the Better Auth session token directly from client cookies.
 * This is used to append to the Authorization header, ensuring authentication works
 * reliably across cross-origin port boundaries (e.g. port 3000 to port 5000).
 */
function getSessionToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )(?:__Secure-)?better-auth\.session_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
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

    const token = getSessionToken();
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
    const token = getSessionToken();
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

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const token = getSessionToken();
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

  const res = await apiClient.postFormData<{ status: string; data: IParsedBillResponse }>(
    '/ai/parse-bill',
    formData
  );
  return res.data;
}

/**
 * Creates a new ESG audit.
 */
export async function createAudit(data: IEsgAuditInput): Promise<unknown> {
  return apiClient.post('/audits', data);
}

export default apiClient;
