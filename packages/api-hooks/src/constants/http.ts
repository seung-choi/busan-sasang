export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
  
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
  
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503
  }
  
  export enum SuccessCode {
    SUCCESS = "SUCCESS",
    SUCCESS_CREATED = "SUCCESS_CREATED",
    SUCCESS_PUT = "SUCCESS_PUT",
    SUCCESS_PATCH = "SUCCESS_PATCH",
    SUCCESS_DELETE = "SUCCESS_DELETE"
  }
  
  export const SUCCESS = {
    getHttpStatus: () => HttpStatus.OK,
    getMessage: () => "성공"
  };
  
  export const METHOD_SUCCESS_CODES = {
    GET: {
      httpStatus: HttpStatus.OK,
      message: "성공"
    },
    POST: {
      httpStatus: HttpStatus.CREATED,
      message: "등록 성공"
    },
    PUT: {
      httpStatus: HttpStatus.ACCEPTED,
      message: "수정 성공"
    },
    PATCH: {
      httpStatus: HttpStatus.ACCEPTED,
      message: "수정 성공"
    },
    DELETE: {
      httpStatus: HttpStatus.NO_CONTENT,
      message: "삭제 성공"
    }
  };
  