import { ErrorResponseBody } from './response';

/**
 * API 응답 상태를 나타내는 인터페이스
 * @template T - 성공 시 받을 데이터의 타입
 * @template P - execute 함수가 받을 파라미터 타입 배열 (기본값: any[])
 */
export interface UseApiResponse<T, P extends any[] = any[]> {
  /** 요청을 통해 받은 데이터 (성공 시), 초기값 null */
  data: T | null;
  /** 요청 중 발생한 에러 객체 (실패 시), 초기값 null */
  error: ErrorResponseBody | null;
  /** 요청 진행 중 여부 플래그 */
  isLoading: boolean;
  /**
   * API 요청을 실행하는 함수.
   * @param args - API 요청 함수에 전달될 파라미터들
   * @returns Promise<T | null> - 성공 시 데이터 T, 실패 시 null 반환
   */
  execute: (...args: P) => Promise<T | null>;
  /** 요청 상태 초기화 함수 */
  reset: () => void;
}