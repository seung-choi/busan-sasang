# @plug/api-hooks

스프링부트 백엔드 서버와 통신하기 위한 React 훅 라이브러리입니다. SWR을 사용하여 데이터 캐싱 및 자동 갱신 기능을 제공합니다.

## 설치

```bash
# 프로젝트 루트에서 실행
pnpm install @plug/api-hooks
```

## 기능

- SWR을 사용한 데이터 요청 및 캐싱
- Fetch API 기반 HTTP 클라이언트
- GET, POST, PUT, DELETE, PATCH 메소드 지원
- 인증 토큰 자동 처리
- 타입스크립트로 작성되어 타입 안전성 보장
- **커스텀 응답 처리기** 지원 - 응답 데이터를 요청별로 다르게 처리 가능
- **스프링부트 응답 형식 자동 지원** - HTTP 메소드별 다른 응답 형식 처리

## 스프링부트 응답 형식 지원

이 라이브러리는 스프링부트 서버의 일반적인 응답 형식에 맞게 최적화되어 있습니다:

### 성공 코드 매핑

각 HTTP 메소드별 성공 코드 매핑:

```
SUCCESS(OK, "성공")                    - GET 요청 (200)
SUCCESS_CREATED(CREATED, "등록 성공")   - POST 요청 (201)
SUCCESS_PUT(ACCEPTED, "수정 성공")      - PUT 요청 (202)
SUCCESS_PATCH(ACCEPTED, "수정 성공")    - PATCH 요청 (202)
SUCCESS_DELETE(NO_CONTENT, "삭제 성공") - DELETE 요청 (204)
```

### 응답 형식

1. **GET 요청** - `DataResponseBody<T>` 형식
   ```json
   {
     "timestamp": "2023-03-28 15:30:45",
     "status": 200,
     "message": "성공",
     "data": [...] // 실제 데이터
   }
   ```

2. **POST 요청** - `CreatedResponseBody<ID>` 형식
   ```json
   {
     "timestamp": "2023-03-28 15:31:22",
     "status": 201,
     "message": "등록 성공"
   }
   ```
   - 생성된 리소스의 ID는 `Location` 헤더에서 추출됩니다.

3. **PUT/PATCH 요청** - `BaseResponseBody` 형식
   ```json
   {
     "timestamp": "2023-03-28 15:32:10",
     "status": 202,
     "message": "수정 성공"
   }
   ```

4. **DELETE 요청** - 본문 없음 (204 No Content)
   - 성공 시 응답 본문이 없으며 상태 코드는 204입니다.

5. **에러 응답** - `ErrorResponseBody` 형식
   ```json
   {
     "timestamp": "2023-03-28 15:33:05",
     "status": 400,
     "message": "잘못된 요청입니다.",
     "errors": {
       "email": ["이메일 형식이 올바르지 않습니다."]
     },
     "path": "/api/users"
   }
   ```

## 사용 예시

### 기본 GET 요청 (스프링부트 응답)

```tsx
import { useApiGet } from '@plug/api-hooks';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserListComponent() {
  // GET 요청 - DataResponseBody<User[]>에서 data 필드만 자동으로 추출됨
  const { data, error, isLoading } = useApiGet<User[]>('/users');

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  
  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### POST 요청 (스프링부트 응답)

```tsx
import { useApiPost } from '@plug/api-hooks';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

function CreateUserForm() {
  const createUser = useApiPost<CreateUserRequest, number>();
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      // POST 요청 - Location 헤더에서 ID 자동 추출
      const newUserId = await createUser('/users', {
        name: "홍길동",
        email: "hong@example.com",
        password: "password123"
      });
      
      console.log('생성된 사용자 ID:', newUserId);
    } catch (error) {
      console.error('사용자 생성 실패:', error);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 */}
      <button type="submit">사용자 생성</button>
    </form>
  );
}
```

### DELETE 요청 (스프링부트 응답)

```tsx
import { useApiDelete } from '@plug/api-hooks';

function DeleteUserButton({ userId }) {
  const deleteUser = useApiDelete();
  
  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      // DELETE 요청 - NO_CONTENT(204) 응답 처리
      await deleteUser(`/users/${userId}`);
      console.log('사용자가 삭제되었습니다.');
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
    }
  }
  
  return <button onClick={handleDelete}>삭제</button>;
}
```

## API

### 응답 타입

```tsx
// 기본 응답 타입
interface BaseResponseBody {
  timestamp: string;
  status: HttpStatus;
  message: string;
}

// 데이터를 포함하는 응답 타입 (주로 GET 요청)
interface DataResponseBody<T> extends BaseResponseBody {
  data: T;
}

// 생성된 리소스의 ID를 포함하는 응답 타입 (주로 POST 요청)
interface CreatedResponseBody extends BaseResponseBody {
  // ID는 응답 본문에 없고 헤더에 있음
}

// 에러 응답 타입
interface ErrorResponseBody extends BaseResponseBody {
  errors?: Record<string, string[]>;
  path?: string;
}
```

### 훅 API

```tsx
// GET 요청
function useApiGet<T>(endpoint: string, options?: ApiRequestOptions<T>): SWRResponse<T, Error>

// POST 요청
function useApiPost<T = unknown, ID = number>(): (
  endpoint: string,
  data?: T,
  options?: RequestOptions<ID>
) => Promise<ID>

// PUT 요청
function useApiPut<T = unknown>(): (
  endpoint: string,
  data?: T,
  options?: RequestOptions<void>
) => Promise<void>

// DELETE 요청
function useApiDelete(): (
  endpoint: string,
  options?: RequestOptions<void>
) => Promise<void>

// PATCH 요청
function useApiPatch<T = unknown>(): (
  endpoint: string,
  data?: T,
  options?: RequestOptions<void>
) => Promise<void>
```

### 커스텀 응답 처리기 사용

기본 응답 처리기가 요구사항에 맞지 않는 경우 사용자 정의 응답 처리기를 지정할 수 있습니다:

```tsx
import { useApiGet, ResponseHandler } from '@plug/api-hooks';

// 특별한 응답 형식을 처리하는 커스텀 핸들러
const customHandler: ResponseHandler<MyType[]> = async (response) => {
  const json = await response.json();
  // 특별한 변환 로직...
  return transformedData;
};

// 커스텀 응답 처리기 사용
const { data } = useApiGet<MyType[]>('/custom-endpoint', {
  responseHandler: customHandler
});
``` 