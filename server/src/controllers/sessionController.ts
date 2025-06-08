// server/src/controllers/sessionController.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import type { SessionService } from '../services/sessionService'
import { UserService } from '../services/userService'
import type { LoginDto } from '../types'

type SessionControllerDeps = {
  sessionService: SessionService
  userService: UserService
}

export const createSessionController = ({ sessionService, userService }: SessionControllerDeps) => {
  /** POST /api/auth/login */
  const login = async (req: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) => {
    try {
      const { email } = req.body
      const user = await sessionService.getUserByEmail(email)
      if (!user) {
        return reply.code(404).send(createErrorResponse('유저를 찾을 수 없습니다.'))
      }
      // TTL: 예) 7일
      const session = await sessionService.createSession(user.id, 7 * 24 * 60 * 60 * 1000)
      return reply.code(201).send(createSuccessResponse({ token: session.token }, '로그인 성공'))
    } catch (err) {
      req.log.error(err)
      return reply.code(500).send(createErrorResponse('로그인 실패'))
    }
  }

  /** DELETE /api/auth/logout */
  const logout = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const auth = req.headers.authorization
      if (!auth?.startsWith('Bearer ')) {
        return reply.code(401).send(createErrorResponse('토큰이 없습니다.'))
      }
      const token = auth.slice(7)
      const deleted = await sessionService.deleteSession(token)
      if (!deleted) {
        return reply.code(400).send(createErrorResponse('로그아웃 실패'))
      }
      return reply.send(createSuccessResponse(null, '로그아웃 성공'))
    } catch (err) {
      req.log.error(err)
      return reply.code(500).send(createErrorResponse('로그아웃 중 오류'))
    }
  }

  /** GET /api/auth/me */
  const me = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // authenticate 에서 req.user = { id, role } 로 붙여뒀으니
      const { id } = req.user as { id: number }
      // **여기서 userService 로 이메일 등 추가 정보 조회**
      const user = await userService.getUserById(id)
      if (!user) return reply.code(404).send(createErrorResponse('유저를 찾을 수 없습니다.'))
      return reply.send(
        createSuccessResponse({
          id: user.id,
          email: user.email, // ← 이 부분이 중요
          role: user.role
        })
      )
    } catch (err) {
      req.log.error(err)
      return reply.code(500).send(createErrorResponse('내 정보 조회 실패'))
    }
  }

  return { login, logout, me }
}

export type SessionController = ReturnType<typeof createSessionController>
