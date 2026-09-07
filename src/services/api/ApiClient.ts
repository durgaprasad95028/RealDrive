/**
 * ============================================================================
 * REALDRIVE CLIENT — HIGH PERFORMANCE HTTP API CLIENT
 * ============================================================================
 * Production HTTP client:
 * - Automatic Authorization Bearer header injection
 * - Exponential backoff retry for network transients
 * - Strong TypeScript response unboxing
 * - Request / response interceptor chain
 */

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    executionTimeMs: number;
  };
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeoutMs?: number;
  retryCount?: number;
}

export class ApiClient {
  private static instance: ApiClient | null = null;
  private baseUrl: string = '/api/v1';
  private authToken: string | null = null;
  private requestInterceptors: Array<(config: RequestOptions) => RequestOptions | Promise<RequestOptions>> = [];
  private responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = [];

  private constructor() {
    this.authToken = typeof localStorage !== 'undefined' ? localStorage.getItem('realdrive_token') : null;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  public setToken(token: string | null): void {
    this.authToken = token;
    if (typeof localStorage !== 'undefined') {
      if (token) {
        localStorage.setItem('realdrive_token', token);
      } else {
        localStorage.removeItem('realdrive_token');
      }
    }
  }

  public getToken(): string | null {
    return this.authToken;
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, window.location.origin);

    if (options.params) {
      for (const [key, val] of Object.entries(options.params)) {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      }
    }

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    let config: RequestOptions = {
      ...options,
      headers,
    };

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const maxRetries = options.retryCount ?? 2;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 15000);

        const response = await fetch(url.toString(), {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let processedResponse = response;
        for (const respInterceptor of this.responseInterceptors) {
          processedResponse = await respInterceptor(processedResponse);
        }

        const data: ApiResponse<T> = await processedResponse.json();

        if (!processedResponse.ok || !data.success) {
          throw new Error(data.error?.message || `HTTP ${processedResponse.status}: ${processedResponse.statusText}`);
        }

        return data.data !== undefined ? data.data : (data as any);
      } catch (err: any) {
        attempt++;
        if (attempt > maxRetries || err.name === 'AbortError') {
          throw err;
        }
        // Exponential backoff
        await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 250));
      }
    }

    throw new Error('Request failed after max retries');
  }

  public get<T = any>(endpoint: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'params'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  public post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = ApiClient.getInstance();
