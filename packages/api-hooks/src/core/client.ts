import ky, {Options} from 'ky';
import { ResponseTypes, RequestOptions } from '../types';

const CONTEXT_PATH = '/3d-map';

export const baseKy = ky.create({
  // TODO: 개발 서버에서 context path 변경
  prefixUrl: `${CONTEXT_PATH}/api`,
  // prefixUrl: '/api',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let errorData: any = {};
          try {
            errorData = await response.json();
          } catch (_) {}
          const message = errorData?.message || errorData?.error || `HTTP ${response.status}`;
          throw new Error(message);
        }
      }
    ]
  }
});

export const externalApiClient = ky.create({
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

const buildKy = (
    options: RequestOptions & Options = {}
) => {
  const { requireAuth = true, ...restOptions } = options;
  const baseOptions: Options = {
    headers: { 'Content-Type': 'application/json' },
    ...restOptions
  };

  if (!requireAuth) {
    return baseKy.extend({ ...baseOptions, hooks: { beforeRequest: [] } });
  }

  return baseKy.extend({ ...baseOptions });
};

export const api = {
  get: async <T>(endpoint: string, options: RequestOptions = {}): Promise<ResponseTypes<T>['GET']> => {
    return buildKy(options).get(endpoint).json();
  },

  post: (endpoint: string, data: unknown, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).post(endpoint, { json: data });
  },

  put: (endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).put(endpoint, { json: data });
  },

  patch: (endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).patch(endpoint, { json: data });
  },

  delete: (endpoint: string, options: RequestOptions = {}): Promise<Response> => {
    return buildKy(options).delete(endpoint);
  },

  getAbsolute: async <T>(absoluteUrl: string): Promise<ResponseTypes<T>['GET']> => {
    return externalApiClient.get(absoluteUrl).json();
  },
};
