import {
  User,
  NewUser,
  UpdateUser,
  SleepRecord,
  NewSleepRecord,
  Session,
  NewSession,
  UpdateSleepRecord
} from '../db/schema'

// 사용자 관련 타입
export {
  User,
  NewUser,
  UpdateUser,
  SleepRecord,
  NewSleepRecord,
  UpdateSleepRecord,
  Session,
  NewSession
}

// API 응답 공통 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

// 사용자 역할 타입
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

// 사용자 생성 DTO
export interface CreateUserDto {
  name: string
  email: string
  role?: UserRole
}

// 사용자 수정 DTO
export interface UpdateUserDto {
  name?: string
  email?: string
  role?: UserRole
}

// 수면 기록 생성 DTO
export interface CreateSleepRecordDto
  extends Omit<NewSleepRecord, 'id' | 'createdAt' | 'updatedAt'> {}

// 수면 기록 수정 DTO
export interface UpdateSleepRecordDto extends UpdateSleepRecord {}

// 로그인 DTO
export interface LoginDto {
  email: string
}

// 세션 생성 DTO
// types/session.ts
export interface CreateSessionDto {
  userId: number
  token: string
  expiresAt: string
}
