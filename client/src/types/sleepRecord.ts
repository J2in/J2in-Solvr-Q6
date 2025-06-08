/**
 * 수면 기록 엔티티
 */
export interface SleepRecord {
  id: number
  userId: number
  startTime: string // ISO 8601 형식의 시작 시각
  endTime: string // ISO 8601 형식의 종료 시각
  durationMinutes: number // 수면 시간(분)
  quality: number // 수면 품질 점수 (1~5)
  notes?: string // 특이사항
  createdAt: string // 생성 일시 (ISO 8601)
  updatedAt: string // 수정 일시 (ISO 8601)
}

/**
 * 수면 기록 생성용 DTO
 */
export interface CreateSleepRecordDto {
  userId: number
  startTime: string
  endTime: string
  durationMinutes: number
  quality?: number // 생략 시 기본값 3으로 처리
  notes?: string
}

/**
 * 수면 기록 수정용 DTO
 */
export interface UpdateSleepRecordDto {
  startTime?: string
  endTime?: string
  durationMinutes?: number
  quality?: number
  notes?: string
}
