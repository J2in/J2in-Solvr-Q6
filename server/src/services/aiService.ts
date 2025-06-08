// server/src/services/aiService.ts
import { StatisticsService } from './statisticsService'

type AiServiceDeps = {
  statisticsService: StatisticsService
}

export class AiService {
  constructor(private stats: StatisticsService) {}

  /** 최근 periodDays일 수면 기록 통계로 요약 리포트 생성 */
  async generateSleepPatternSummary(userId: number, periodDays: number): Promise<string> {
    // 1) 통계 데이터 조회
    const trend = await this.stats.getSleepTrend(userId, periodDays)
    const durations = trend.map(r => r.totalMinutes)
    const avg = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    const min = Math.min(...durations)
    const max = Math.max(...durations)

    // 2) 프롬프트 준비
    const prompt = `
사용자님의 최근 ${periodDays}일 수면 기록:
- 평균 수면: ${Math.floor(avg / 60)}시간 ${avg % 60}분
- 최단 수면: ${Math.floor(min / 60)}시간 ${min % 60}분
- 최장 수면: ${Math.floor(max / 60)}시간 ${max % 60}분

위 정보를 바탕으로, 4 문장 이내로 수면 습관에 대해서 조언만 보내주세요.
`

    // 3) ESM 모듈을 dynamic import
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY })

    // 4) AI 호출
    const config = { responseMimeType: 'text/plain' }
    const model = 'gemma-3-1b-it'
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]

    let summary = ''
    const response = await ai.models.generateContentStream({ model, config, contents })
    for await (const chunk of response) {
      if (typeof chunk.text === 'string') summary += chunk.text
    }
    return summary.trim()
  }
}
