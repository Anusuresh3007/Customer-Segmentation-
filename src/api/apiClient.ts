import axios, { AxiosInstance, AxiosError } from 'axios';

const STORAGE_KEY_BASE_URL = 'segmentpulse_api_base_url';
const STORAGE_KEY_MOCK_MODE = 'segmentpulse_use_mock';

export const getApiBaseUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_BASE_URL) ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8080/api';
};

export const setApiBaseUrl = (url: string): void => {
  localStorage.setItem(STORAGE_KEY_BASE_URL, url);
  apiClient.defaults.baseURL = url;
};

export const isMockMode = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY_MOCK_MODE);
  if (stored !== null) {
    return stored === 'true';
  }
  // Default to mock mode in development if env says so or default true
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
};

export const setMockMode = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_KEY_MOCK_MODE, enabled ? 'true' : 'false');
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // You can inject an authorization header here if backend auth is implemented:
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Return friendly error object without crashing
    const message = (error.response?.data as any)?.message || error.message || 'Network request failed';
    return Promise.reject(new Error(message));
  }
);

export const testBackendConnection = async (customUrl?: string): Promise<{ success: boolean; message: string; latencyMs: number }> => {
  const targetUrl = customUrl || getApiBaseUrl();
  const startTime = Date.now();
  try {
    const res = await axios.get(`${targetUrl}/health`, { timeout: 4000 });
    const latency = Date.now() - startTime;
    return {
      success: res.status >= 200 && res.status < 300,
      message: `Connected successfully (${latency}ms)`,
      latencyMs: latency
    };
  } catch (err: any) {
    const latency = Date.now() - startTime;
    // Also try base URL root
    try {
      await axios.get(targetUrl, { timeout: 3000 });
      return {
        success: true,
        message: `Endpoint reachable (${Date.now() - startTime}ms)`,
        latencyMs: Date.now() - startTime
      };
    } catch {
      return {
        success: false,
        message: err.message || 'Unable to connect to backend server. Ensure backend is running.',
        latencyMs: latency
      };
    }
  }
};
