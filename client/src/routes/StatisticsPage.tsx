import { useStatistics } from '../hooks/useStatistics'
import { useAiAdvice } from '../hooks/useAiAdvice'
import SleepTrendChart from '../components/ui/SleepTrendChart'
import WeekdayAverageChart from '../components/ui/WeekdayAverageChart'

export default function StatisticsPage() {
  // AI 조언 훅
  const { advice, loading: adviceLoading, error: adviceError } = useAiAdvice()

  const { data: trend, loading: l1, error: e1, refresh: r1 } = useStatistics('sleep-trend', 30)
  const { data: weekday, loading: l2, error: e2, refresh: r2 } = useStatistics('weekday-average')

  if (l1 || l2) return <p>Loading...</p>
  if (e1 || e2) return <p style={{ color: 'red' }}>Error: {e1 || e2}</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>수면 통계 인사이트</h1>

      {/* AI 조언 섹션 */}
      <section style={{ marginBottom: 40 }}>
        <h2>AI의 조언</h2>
        {adviceLoading && <p>AI 조언을 불러오는 중...</p>}
        {adviceError && <p style={{ color: 'red' }}>에러: {adviceError}</p>}
        {advice && (
          <blockquote
            style={{ fontStyle: 'italic', background: '#f9f9f9', padding: '1em', borderRadius: 4 }}
          >
            {advice}
          </blockquote>
        )}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>최근 30일 수면 시간 추이</h2>
        <SleepTrendChart data={trend} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>요일별 평균 수면 시간</h2>
        <WeekdayAverageChart data={weekday} />
      </section>
    </div>
  )
}
