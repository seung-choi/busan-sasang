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

## 인증 관련 훅

- `useAuth()` - 현재 인증 상태 확인
- `useLogin()` - 로그인 기능
- `useSignup()` - 회원가입 기능
- `useLogout()` - 로그아웃 기능
- `useCurrentUser()` - 현재 사용자 정보 조회
- `useRefreshToken()` - 토큰 갱신
- `useChangePassword()` - 비밀번호 변경
- `useResetPassword()` - 비밀번호 초기화 요청
- `useResetPasswordConfirm()` - 비밀번호 초기화 확인

## 타입 정의

인증 관련 타입은 다음과 같이 정의되어 있습니다:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

## 사용 예시

### 로그인 기능 사용하기

```tsx
import { useLogin } from '@plug/api-hooks';
import { useState } from 'react';

const LoginPage = () => {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login({ email, password });
      console.log('로그인 성공:', response.user);
      // 로그인 성공 후 이동
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('로그인 실패:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
          <a
            href="/forgot-password"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            비밀번호 찾기
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
```

### 사용자 인증 상태 확인하기

```tsx
import { useAuth } from '@plug/api-hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// 인증된 사용자만 접근 가능한 페이지를 위한 HOC
export const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isLoading, router]);
    
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    return <Component {...props} />;
  };
  
  return AuthenticatedComponent;
};

// 예시 사용법
const DashboardPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <p className="mb-4">환영합니다, {user?.name}님!</p>
      {/* 대시보드 내용 */}
    </div>
  );
};

export default withAuth(DashboardPage);
```

### useSWRApi를 사용한 데이터 가져오기

```tsx
import { useSWRApi } from '@plug/api-hooks';

// 게시글 타입 정의
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const PostsPage = () => {
  // SWR을 사용하여 게시글 목록 가져오기
  const { data: posts, isLoading, error, mutate } = useSWRApi<Post[]>('/posts');
  
  if (isLoading) {
    return <div className="p-4">게시글을 불러오는 중...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">에러: {error.message}</div>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>
      
      <button
        onClick={() => mutate()} // 데이터 갱신
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        새로고침
      </button>
      
      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">작성자: {post.author}</p>
            <p className="mt-2">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        
        {posts?.length === 0 && (
          <p className="text-gray-500">게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
```

### useApi를 사용한 데이터 제출

```tsx
import { useApi } from '@plug/api-hooks';
import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  const contactApi = useApi<{ success: boolean }>();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await contactApi.execute('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      setSubmitted(true);
      // 폼 초기화
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('문의하기 제출 실패:', err);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">문의하기</h2>
        
        {contactApi.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {contactApi.error}
          </div>
        )}
        
        {submitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            메시지가 성공적으로 전송되었습니다.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              메시지
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={5}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={contactApi.isLoading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {contactApi.isLoading ? '전송 중...' : '전송하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage; 