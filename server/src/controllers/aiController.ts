import { FastifyReply, FastifyRequest } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import { AiService } from '../services/aiService'

type AiControllerDeps = { aiService: AiService }

export const createAiController = ({ aiService }: AiControllerDeps) => ({
  // GET /api/ai/advice?userId=123&periodDays=30
  summary: async (
    req: FastifyRequest<{ Querystring: { periodDays?: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = req.user!.id
      const periodDays = parseInt(req.query.periodDays || '30', 10)
      const report = await aiService.generateSleepPatternSummary(userId, periodDays)
      return reply.code(200).send(createSuccessResponse({ report }))
    } catch (err) {
      console.error('🛑 AI 요약 실패 세부 에러:', err)
      req.log.error(err)
      return reply.code(500).send(createErrorResponse('AI 요약 리포트 생성에 실패했습니다.'))
    }
  }
})
