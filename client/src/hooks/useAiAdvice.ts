import { useState, useEffect } from 'react'
import api, { ApiResponse } from '../services/api'
import { useAuth } from './useAuth'

export const useAiAdvice = (periodDays = 30) => {
  const { userId } = useAuth()
  const [advice, setAdvice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    api
      .get<ApiResponse<{ report: string }>>(`/ai/advice?periodDays=${periodDays}`)
      .then(res => {
        if (cancelled) return
        if (res.data.success && res.data.data) {
          setAdvice(res.data.data.report)
        } else {
          setError(res.data.error || 'AI 조언을 불러오지 못했습니다.')
        }
      })
      .catch(err => {
        if (cancelled) return
        setError(err.response?.data?.error || err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId, periodDays])

  return { advice, loading, error }
}
