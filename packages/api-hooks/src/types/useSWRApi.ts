/**
 * 지원되는 HTTP 메서드 타입
 *
 * 현재 `useSWRApi` 훅에서 지원하는 메서드만 정의되어 있으며,
 * 기본적으로 `GET`과 `DELETE` 요청을 처리합니다.
 *
 * - 'GET': 데이터 조회용 요청
 * - 'DELETE': 리소스 삭제용 요청
 */
export type AllowedMethod = 'GET' | 'DELETE';

/**
 * useSWRApi 훅의 반환 타입
 *
 * @template T - API 응답 데이터의 타입
 *
 * SWR을 기반으로 한 API 훅이 반환하는 상태값 및 유틸리티입니다.
 * - `data`: 성공 시 반환되는 응답 데이터
 * - `boundary`: 실패 시 발생한 에러 객체
 * - `isLoading`: 요청 진행 여부
 * - `mutate`: 캐시를 갱신하거나 데이터를 다시 불러오는 함수
 *
 * @example
 * const { data, boundary, isLoading, mutate } = useSWRApi<User[]>('/api/users');
 */
export interface UseSWRApiReturn<T> {
  /** 성공 시 응답 데이터 (초기값: null) */
  data: T | null;

  /** 실패 시 발생한 에러 객체 (초기값: undefined) */
  error: Error | undefined;

  /** 요청이 진행 중인지 나타내는 플래그 */
  isLoading: boolean;

  /**
   * 데이터 재요청 및 캐시 갱신을 위한 함수
   *
   * - `GET`: 데이터를 다시 불러옴
   * - `DELETE`: 재요청 후 캐시 무효화에 활용 가능
   *
   * @example
   * await mutate(); // 최신 데이터로 재요청
   */
  mutate: () => void;
}
