import Fastify from 'fastify'
import fp from 'fastify-plugin'
import authenticate from './plugins/authenticate'
import cors from '@fastify/cors'
import env from './config/env'
import { initializeDatabase, getDb } from './db'
import runMigration from './db/migrate'
import { createUserService } from './services/userService'
import { createSleepRecordService } from './services/sleepRecordService'
import { createSessionService } from './services/sessionService'
import { createStatisticsService } from './services/statisticsService'
import { AiService } from './services/aiService'

import { createRoutes } from './routes'
import { AppContext } from './types/context'

// Fastify 인스턴스 생성
const fastify = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
})

// 서버 시작 함수
async function start() {
  try {
    // CORS 설정
    await fastify.register(cors, {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    })

    // 데이터베이스 마이그레이션 및 초기화
    await runMigration()
    await initializeDatabase()

    // 서비스 및 컨텍스트 초기화
    const db = await getDb()
    const statisticsService = createStatisticsService({ db })
    const context: AppContext = {
      userService: createUserService({ db }),
      sleepRecordService: createSleepRecordService({ db }),
      sessionService: createSessionService({ db }),
      statisticsService: statisticsService,
      aiService: new AiService(statisticsService)
    }

    // Fastify 인스턴스에 decorate
    fastify.decorate('di', context)

    // auth 플러그인은 decorate 이후에 등록
    await fastify.register(fp(authenticate))

    // 라우트 등록
    await fastify.register(createRoutes(context))

    // 서버 시작
    await fastify.listen({ port: env.PORT, host: env.HOST })

    console.log(`서버가 http://${env.HOST}:${env.PORT} 에서 실행 중입니다.`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

// 서버 시작
start()
