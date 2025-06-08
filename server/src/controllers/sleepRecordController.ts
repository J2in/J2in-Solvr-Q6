import { FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import {
  CreateSleepRecordDto,
  UpdateSleepRecordDto,
  SleepRecord as SleepRecordType
} from '../types'
import { SleepRecordService } from '../services/sleepRecordService'

type SleepRecordControllerDeps = {
  sleepRecordService: SleepRecordService
}

export const createSleepRecordController = ({ sleepRecordService }: SleepRecordControllerDeps) => {
  // 1) 모든 수면 기록 조회
  const getAllSleepRecords = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const records = await sleepRecordService.getAll()
      return reply.code(200).send(createSuccessResponse<SleepRecordType[]>(records))
    } catch (error) {
      reply.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 목록을 불러오는데 실패했습니다.'))
    }
  }

  // 2) 사용자별 수면 기록 조회
  const getSleepRecordsByUserId = async (
    req: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = parseInt(req.params.userId, 10)
      if (isNaN(userId)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }
      const records = await sleepRecordService.getByUserId(userId)
      return reply.code(200).send(createSuccessResponse<SleepRecordType[]>(records))
    } catch (error) {
      reply.log.error(error)
      return reply
        .code(500)
        .send(createErrorResponse('사용자 수면 기록을 불러오는데 실패했습니다.'))
    }
  }

  // 3) 단일 수면 기록 조회
  const getSleepRecordById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 기록 ID입니다.'))
      }
      const record = await sleepRecordService.getById(id)
      if (!record) {
        return reply.code(404).send(createErrorResponse('수면 기록을 찾을 수 없습니다.'))
      }
      return reply.code(200).send(createSuccessResponse<SleepRecordType>(record))
    } catch (error) {
      reply.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 조회에 실패했습니다.'))
    }
  }

  // 4) 수면 기록 생성
  const createSleepRecord = async (
    req: FastifyRequest<{ Body: CreateSleepRecordDto }>,
    reply: FastifyReply
  ) => {
    try {
      const dto = req.body
      const newRecord = await sleepRecordService.create(dto)
      return reply
        .code(201)
        .send(createSuccessResponse<SleepRecordType>(newRecord, '수면 기록이 생성되었습니다.'))
    } catch (error) {
      reply.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 생성에 실패했습니다.'))
    }
  }

  // 5) 수면 기록 수정
  const updateSleepRecord = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateSleepRecordDto }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(req.params.id, 10)
      const dto = req.body
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 기록 ID입니다.'))
      }
      const existing = await sleepRecordService.getById(id)
      if (!existing) {
        return reply.code(404).send(createErrorResponse('수면 기록을 찾을 수 없습니다.'))
      }
      const updated = await sleepRecordService.update(id, dto)
      return reply
        .code(200)
        .send(createSuccessResponse<SleepRecordType>(updated!, '수면 기록이 수정되었습니다.'))
    } catch (error) {
      reply.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 수정에 실패했습니다.'))
    }
  }

  // 6) 수면 기록 삭제
  const deleteSleepRecord = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 기록 ID입니다.'))
      }
      const existing = await sleepRecordService.getById(id)
      if (!existing) {
        return reply.code(404).send(createErrorResponse('수면 기록을 찾을 수 없습니다.'))
      }
      const deleted = await sleepRecordService.remove(id)
      if (!deleted) {
        return reply.code(500).send(createErrorResponse('수면 기록 삭제에 실패했습니다.'))
      }
      return reply.code(200).send(createSuccessResponse<null>(null, '수면 기록이 삭제되었습니다.'))
    } catch (error) {
      reply.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 삭제에 실패했습니다.'))
    }
  }

  return {
    getAllSleepRecords,
    getSleepRecordsByUserId,
    getSleepRecordById,
    createSleepRecord,
    updateSleepRecord,
    deleteSleepRecord
  }
}

export type SleepRecordController = ReturnType<typeof createSleepRecordController>
