import ky, { Options } from 'ky';

const CONTEXT_PATH = '/3d-map';

export const fileClient = ky.create({
  credentials: 'include',
  prefixUrl: `${CONTEXT_PATH}/api`,
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

type FileApiOptions = Omit<Options, 'json'> & { requireAuth?: boolean };

export const fileApi = {
  upload: async (endpoint: string, formData: FormData, options: FileApiOptions = {}) => {
    const { requireAuth = true, ...restOptions } = options;
    const client = requireAuth
      ? fileClient
      : fileClient.extend({ hooks: { beforeRequest: [] } });
    
    // 응답을 직접 받아서 처리
    const response = await client.post(endpoint, {
      body: formData,
      ...restOptions,
    });
    
    // 응답에 body가 없고 Location 헤더만 있는 경우
    if (response.headers.has('Location')) {
      const location = response.headers.get('Location');
      const fileId = extractFileIdFromLocation(location);
      
      return {
        fileId,
        location
      };
    }
    
    // 응답에 body가 있는 경우 (JSON으로 파싱 가능한 경우)
    try {
      return await response.json();
    } catch (error) {
      // JSON 파싱이 실패한 경우, 빈 응답이거나 다른 형식일 수 있음
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText
      };
    }
  }
};

// Location 헤더에서 fileId 추출 함수
function extractFileIdFromLocation(location: string | null): number | undefined {
  if (!location) return undefined;
  
  // URL에서 마지막 경로 세그먼트를 추출 (예: "/files/123" -> "123")
  const matches = location.match(/\/([^\/]+)$/);
  if (matches && matches[1]) {
    const fileId = parseInt(matches[1], 10);
    if (!isNaN(fileId)) {
      return fileId;
    }
  }
  return undefined;
}