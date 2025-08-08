import useSWR, { SWRConfiguration } from 'swr'
import { api } from '../core/client'
import type { 
  AllowedMethod,  
  UseSWRApiReturn,
  RequestOptions,
  DataResponseBody 
} from '../types'

/**
 * SWR 기반의 API 요청 훅
 *
 * - SWR(Suspense 기반 캐싱 & 자동 갱신)을 이용해 GET/DELETE 요청을 처리합니다.
 * - 자동 캐싱, revalidation, focus 시 재요청 등의 기능을 제공합니다.
 *
 * @template T - 성공 시 받을 응답 데이터 타입
 * @param url - 요청할 API 엔드포인트
 * @param method - HTTP 메서드 (기본값: 'GET')
 * @param options - API 요청에 사용할 옵션 객체 (헤더, 인증 여부 등)
 * @param config - SWR의 추가 설정 객체
 * @returns UseSWRApiReturn<T> - SWR이 관리하는 상태(data, boundary, isLoading, mutate)를 포함한 객체
 *
 * @example
 * const { data, boundary, isLoading } = useSWRApi<User[]>('/api/users');
 *
 * @example
 * const { mutate } = useSWRApi('/api/item/1', 'DELETE');
 * const handleDelete = async () => {
 *   await mutate(); // DELETE 요청 후 캐시 무효화
 * };
 */
export function useSWRApi<T>(
  url: string,
  method: AllowedMethod = 'GET',
  options?: RequestOptions,
  config?: SWRConfiguration
): UseSWRApiReturn<T> {
  /**
   * API 요청을 수행하는 fetcher 함수
   * @returns 응답 데이터 또는 null
   */
  const fetcher = async (): Promise<T> => {
    if (method === 'GET') {
      const response = await api.get<DataResponseBody<T>>(url, options)
      return response.data as T
    }

    if (method === 'DELETE') {
      await api.delete(url, options)
      return null as T
    }

    throw new Error(`Unsupported method: ${method}`)
  }

  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    ...config,
  })

  return {
    data: data ?? null,
    error,
    isLoading,
    mutate,
  }
}
