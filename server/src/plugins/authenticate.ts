// server/src/auth/authenticate.ts
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { SessionService } from '../services/sessionService'
import { UserRole } from '../types'

// 요청 객체에 user 속성 추가
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
    di: {
      sessionService: SessionService
    }
  }
  interface FastifyRequest {
    user: { id: number; role: UserRole }
  }
}

const authenticate: FastifyPluginAsync = async fastify => {
  fastify.decorateRequest('user')

  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return reply.code(401).send({ success: false, error: '토큰이 없습니다.' })
    }

    const token = auth.slice(7)
    const session = await fastify.di.sessionService.getSessionByToken(token)
    if (!session || new Date(session.expiresAt) < new Date()) {
      return reply.code(401).send({ success: false, error: '세션이 유효하지 않습니다.' })
    }
    // req.user 에 user 정보 부착
    req.user = { id: session.userId, role: UserRole.USER }
  })
}

export default authenticate
