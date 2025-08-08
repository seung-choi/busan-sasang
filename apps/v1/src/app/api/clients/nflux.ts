// NFlux Platform API 클라이언트 설정
import ky from 'ky';

let authToken: string | null = null;

// 클라이언트 인스턴스 캐시
const clientCache = new Map<string, ReturnType<typeof ky.create>>();

// LocalStorage에서 accessToken 가져오기
const getAccessTokenFromStorage = (): string | null => {
  try {
    return localStorage.getItem('LOCAL_TOCKEN');
  } catch (error) {
    console.warn('LocalStorage에서 accessToken을 가져올 수 없습니다:', error);
    return null;
  }
};

export const setAuthToken = (token: string) => {
  authToken = token;
  // 토큰이 변경되면 캐시 초기화
  clientCache.clear();
};

export const getAuthToken = () => authToken;

const createKyClient = (baseUrl: string, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // 토큰 우선순위: 파라미터 토큰 > 설정된 authToken > LocalStorage의 accessToken
  const finalToken = token || authToken || getAccessTokenFromStorage();
  
  if (finalToken) {
    headers['Authorization'] = `Bearer ${finalToken}`;
  }

  return ky.create({
    prefixUrl: baseUrl,
    headers,
    timeout: 15000,
    retry: 2,
    hooks: {
      afterResponse: [
        async (_request, _options, response) => {
          if (!response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let errorData: any = {};
            try {
              errorData = await response.json();            
            } catch (error) {
              console.error("NFlux API Error: Failed to parse error response", error);
            }
            
            const message = errorData?.message || errorData?.error || `NFlux API Error: ${response.status}`;
            throw new Error(message);
          }
          
          return response;
        }
      ]
    }
  });
};


// const BASE_URL = 'http://192.168.4.22:8090/HI-SMP/poi';
const BASE_URL = 'http://101.254.21.120:10300/HI-SMP';

export const createNfluxApiClient = (customAuthToken?: string, stationId?: string) => {
  const token = customAuthToken || authToken || getAccessTokenFromStorage();
  const baseUrl = stationId 
    ? `${BASE_URL}/poi/station/${stationId}`
    : `${BASE_URL}/poi/station`;

  const cacheKey = `${baseUrl}:${token || 'no-token'}`;
  
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }
  
  const client = createKyClient(baseUrl, token || undefined);
  clientCache.set(cacheKey, client);
  
  return client;
}

export const createNfluxWidgetApiClient = (customAuthToken?: string) => {
  const token = customAuthToken || authToken || getAccessTokenFromStorage();
  const baseUrl = `${BASE_URL}`;

  const cacheKey = `widget:${baseUrl}:${token || 'no-token'}`;
  
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }
  
  const client = createKyClient(baseUrl, token || undefined);
  clientCache.set(cacheKey, client);
  
  return client;
}

export const nfluxApiClient = createNfluxApiClient();

export const withAuth = (token: string) => {
  return createNfluxApiClient(token);
};

// 캐시 관리 함수들
export const clearClientCache = () => {
  clientCache.clear();
};

export const getCacheSize = () => {
  return clientCache.size;
};

// LocalStorage의 accessToken이 변경되었을 때 캐시를 초기화하는 함수
export const refreshTokenCache = () => {
  clientCache.clear();
  console.log('API 클라이언트 캐시가 초기화되었습니다.');
};
