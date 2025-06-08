import { useStatistics } from '../hooks/useStatistics'
import { useAiAdvice } from '../hooks/useAiAdvice'
import SleepTrendChart from '../components/ui/SleepTrendChart'
import WeekdayAverageChart from '../components/ui/WeekdayAverageChart'

export default function StatisticsPage() {
  const { advice, loading: adviceLoading, error: adviceError } = useAiAdvice()
  const {
    data: trendData,
    loading: trendLoading,
    error: trendError,
    refresh: refreshTrend
  } = useStatistics('sleep-trend', 30)
  const {
    data: weekdayData,
    loading: weekLoading,
    error: weekError,
    refresh: refreshWeek
  } = useStatistics('weekday-average')

  const isLoading = adviceLoading || trendLoading || weekLoading
  const error = adviceError || trendError || weekError

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">수면 관리 인사이트</h1>

      {/* AI 조언 */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">🤖 AI의 조언</h2>
        {adviceLoading && <p className="text-gray-500">로딩 중...</p>}
        {adviceError && <p className="text-red-500">에러: {adviceError}</p>}
        {advice && <p className="italic text-gray-700">"{advice}"</p>}
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📈 최근 30일 수면 추이</h2>
            <button onClick={refreshTrend} className="text-sm text-blue-500 hover:underline">
              새로고침
            </button>
          </div>
          <SleepTrendChart data={trendData} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📊 요일별 평균 수면</h2>
            <button onClick={refreshWeek} className="text-sm text-blue-500 hover:underline">
              새로고침
            </button>
          </div>
          <WeekdayAverageChart data={weekdayData} />
        </section>
      </div>

      {/* 에러 및 로딩 처리 */}
      {isLoading && (
        <p className="text-center text-gray-500 mt-6">전체 데이터를 로딩 중입니다...</p>
      )}
      {error && <p className="text-center text-red-500 mt-6">에러 발생: {error}</p>}
    </div>
  )
}
