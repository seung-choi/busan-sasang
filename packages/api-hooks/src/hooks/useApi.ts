import { useState, useCallback, useRef, useEffect } from 'react';
import { api, fileApi } from '../core';
import {
  UseApiResponse,
  DataResponseBody,
  ErrorResponseBody,
  RequestOptions,
} from '../types';



/**
 * API 요청을 처리하는 범용 커스텀 훅
 *
 * @template T - API 성공 시 반환될 최종 데이터의 타입
 * @template P - `execute` 함수 및 내부 `apiMethod`가 받을 파라미터들의 타입 배열
 * @param apiMethod - 실제 API 호출을 수행하는 비동기 함수. (...args: P) => Promise<unknown> 형태여야 함.
 * 이 함수는 성공 시 T 타입의 데이터, { data: T } 형태의 객체, 또는 void/null/undefined를 반환할 수 있음.
 * 실패 시 Error 또는 ErrorResponseBody 형태의 객체를 throw해야 함.
 * @returns UseApiResponse<T, P> - API 상태(data, boundary, loading)와 실행 함수(execute), 초기화 함수(reset) 포함 객체
 */
export function useApi<T, P extends any[] = any[]>(
  apiMethod: (...args: P) => Promise<unknown>,
): UseApiResponse<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ErrorResponseBody | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    if (isMounted.current) {
      setData(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);


  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      if (!isMounted.current) return null;

      setIsLoading(true);
      setError(null);
      setData(null); 

      try {
        const response = await apiMethod(...args);

        if (!isMounted.current) return null;

        // 1. void 응답 처리 (e.g., 성공적인 DELETE)
        if (response === undefined || response === null) {
          setData(null); 
          return null;
        }

        // 2. { data: T } 형태의 응답 처리 (DataResponseBody)
        //    - response가 null이 아니고, 객체이며, 'data' 속성을 가지는지 확인
        if (typeof response === 'object' && response !== null && 'data' in response) {
           // response가 DataResponseBody<T>라고 가정하고 data 추출
           // 만약 response.data의 타입이 T가 아닐 수 있다면 추가 타입 가드 필요
          const responseData = (response as DataResponseBody<T>).data;
          setData(responseData);
          return responseData;
        }

        // 3. 그 외의 경우, 응답 자체가 T 타입 데이터라고 간주
        //    - 이 경우 apiMethod가 반환하는 타입과 T가 일치해야 함
        //    - 타입 단언(as T)은 불가피하나, 위의 경우들을 먼저 체크하여 안정성 향상
        setData(response as T);
        return response as T;

      } catch (err) {
        if (!isMounted.current) return null; // 에러 발생 후 언마운트 시 상태 업데이트 방지

        console.error("API 요청 오류:", err);
        let processedError: ErrorResponseBody;

        if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
          processedError = err as ErrorResponseBody;
        } else if (err instanceof Error) {
          processedError = {
            status: (err as any).status || 500, // status 코드가 있다면 사용, 없으면 500
            message: err.message,
            timestamp: new Date().toISOString(),
            code: (err as any).code || 'CLIENT_ERROR', // code가 있다면 사용
          };
        } else {
          processedError = {
            status: 500,
            message: '알 수 없는 오류가 발생했습니다.',
            timestamp: new Date().toISOString(),
            code: 'UNKNOWN_ERROR',
          };
        }
        setError(processedError);
        return null;
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [apiMethod]
  );

  return { data, error, isLoading, execute, reset };
}

/**
 * GET 요청을 위한 훅
 * @template T - 응답 데이터의 타입
 * @param url - 요청할 URL
 * @param options - 요청 옵션 (RequestInit + requireAuth)
 */
export const useGet = <T>(url: string, options?: RequestOptions) => {
  return useApi<T, []>(() => api.get<T>(url, options));
};

/**
 * POST 요청을 위한 훅
 * @template T - 응답 데이터의 타입
 * @template ReqData - 요청 본문(body) 데이터의 타입 (기본값: any)
 * @param url - 요청할 URL
 * @param options - 요청 옵션 (RequestInit + requireAuth)
 */
export const usePost = <T, ReqData = any>(url: string, options?: RequestOptions) => {
  // POST 요청은 execute 호출 시 요청 데이터를 받으므로 P는 [ReqData]
  return useApi<T, [ReqData]>((requestData) => api.post(url, requestData, options));
};

/**
 * PUT 요청을 위한 훅
 * @template T - 응답 데이터의 타입
 * @template ReqData - 요청 본문(body) 데이터의 타입 (기본값: any)
 * @param url - 요청할 URL
 * @param options - 요청 옵션 (RequestInit + requireAuth)
 */
export const usePut = <T, ReqData = any>(url: string, options?: RequestOptions) => {
  // PUT 요청은 execute 호출 시 요청 데이터를 받으므로 P는 [ReqData]
  return useApi<T, [ReqData]>((requestData) => api.put(url, requestData, options));
};

/**
 * PATCH 요청을 위한 훅
 * @template T - 응답 데이터의 타입
 * @template ReqData - 요청 본문(body) 데이터의 타입 (기본값: any)
 * @param url - 요청할 URL
 * @param options - 요청 옵션 (RequestInit + requireAuth)
 */
export const usePatch = <T, ReqData = any>(url: string, options?: RequestOptions) => {
  // PATCH 요청은 execute 호출 시 요청 데이터를 받으므로 P는 [ReqData]
  return useApi<T, [ReqData]>((requestData) => api.patch(url, requestData, options));
};

/**
 * DELETE 요청을 위한 훅
 * DELETE 요청은 성공 시 보통 본문(body)이 없으므로 T는 null 또는 void 처리.
 * 여기서는 성공 시 data를 null로 설정하도록 T를 `null` 타입으로 지정.
 * @param url - 요청할 URL
 * @param options - 요청 옵션 (RequestInit + requireAuth)
 */
export const useDelete = (url: string, options?: RequestOptions) => {
  return useApi<null, []>(() => api.delete(url, options));
};

export const useFileApi = <T = any>(url: string = "/files/upload", options?: RequestOptions) => {
  return useApi<T, [FormData]>((formData) => fileApi.upload(url, formData, options));
};