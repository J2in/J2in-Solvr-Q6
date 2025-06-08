import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export interface StatRecord {
  period: string
  count: number
}

export const useStatistics = (type: 'sleep-trend' | 'weekday-average', days?: number) => {
  const [data, setData] = useState<StatRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url =
        type === 'sleep-trend'
          ? `/statistics/sleep-trend${days ? `?days=${days}` : ''}`
          : `/statistics/weekday-average`
      const res = await api.get<{ data: StatRecord[] }>(url)
      setData(res.data.data)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [type, days])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { data, loading, error, refresh: fetchStats }
}
