/**
 * 날짜 문자열을 한국어 형식으로 포맷팅하는 함수
 * @param dateStr - 포맷팅할 날짜 문자열
 * @param options - Intl.DateTimeFormatOptions를 통한 커스텀 포맷 옵션
 * @returns 포맷팅된 날짜 문자열
 * 
 * @example
 * // 기본 포맷: 2024년 3월 15일 오후 02:30:45
 * DateFormatter('2024-03-15T14:30:45')
 * 
 * // 연도만 표시
 * DateFormatter('2024-03-15T14:30:45', { year: 'numeric' })
 * 
 * // 날짜만 표시 (2자리 숫자)
 * DateFormatter('2024-03-15T14:30:45', { 
 *   year: 'numeric', 
 *   month: '2-digit', 
 *   day: '2-digit' 
 * })
 * 
 * // 시간만 표시
 * DateFormatter('2024-03-15T14:30:45', { 
 *   hour: '2-digit', 
 *   minute: '2-digit' 
 * })
 * 
 * // 기본 옵션 수정 예시
 * // 월을 숫자로 표시 (기본값: 'long' -> 'numeric')
 * DateFormatter('2024-03-15T14:30:45', { month: 'numeric' })
 * 
 * // 시간을 24시간제로 표시 (기본값: '2-digit' -> '2-digit', hour12: false)
 * DateFormatter('2024-03-15T14:30:45', { hour12: false })
 * 
 * // 초 단위 제외 (기본값에 second 옵션 제거)
 * DateFormatter('2024-03-15T14:30:45', { 
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 *   hour: '2-digit',
 *   minute: '2-digit'
 * })
 */
export default function DateFormatter(dateStr: string, options?:Intl.DateTimeFormatOptions) {
    const date = new Date(dateStr);
    const koreanTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Seoul',
        ...options
    }).format(koreanTime);
}