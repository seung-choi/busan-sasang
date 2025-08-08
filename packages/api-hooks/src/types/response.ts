import { HttpStatus } from '../constants';

export interface BaseResponseBody {
  timestamp: string;
  status: HttpStatus;
  message: string;
}

export interface DataResponseBody<T> extends BaseResponseBody {
  headers: any;
  data: T;
}

export interface CreatedResponseBody {
  id: number | string | null;
}

/** 에러 응답 */
export interface ErrorResponseBody extends BaseResponseBody {
  code: string;
  error?: string;
}

/** HTTP 메서드별 응답 타입 정의 */
export type ResponseTypes<T> = {
  GET: DataResponseBody<T>;
  CREATE: CreatedResponseBody;
  POST: DataResponseBody<T>;
  PUT: BaseResponseBody;
  PATCH: BaseResponseBody;
  DELETE: void;
};
