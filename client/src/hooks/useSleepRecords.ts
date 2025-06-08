import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export interface SleepRecord {
  id: number
  userId: number
  startTime: string
  endTime: string
  durationMinutes: number
  quality: number
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const useSleepRecords = (userId?: number) => {
  const [data, setData] = useState<SleepRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const url = userId ? `/api/sleep-records/user/${userId}` : `/api/sleep-records`
      const res = await axios.get<ApiResponse<SleepRecord[]>>(url)
      setData(res.data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const createRecord = useCallback(async (body: Partial<SleepRecord>) => {
    const res = await axios.post<ApiResponse<SleepRecord>>('/api/sleep-records', body)
    setData(prev => [...prev, res.data.data])
    return res.data.data
  }, [])

  const updateRecord = useCallback(async (id: number, body: Partial<SleepRecord>) => {
    const res = await axios.put<ApiResponse<SleepRecord>>(`/api/sleep-records/${id}`, body)
    setData(prev => prev.map(r => (r.id === id ? res.data.data : r)))
    return res.data.data
  }, [])

  const deleteRecord = useCallback(async (id: number) => {
    await axios.delete(`/api/sleep-records/${id}`)
    setData(prev => prev.filter(r => r.id !== id))
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return {
    data,
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    fetchAll,
    refresh: fetchAll
  }
}
