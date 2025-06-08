import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { ApiResponse } from '@/services/api'

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

export const useSleepRecords = (userId?: number) => {
  const [data, setData] = useState<SleepRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const url = userId ? `/api/sleep-records/user/${userId}` : `/api/sleep-records`
      const res = await axios.get<ApiResponse<SleepRecord[]>>(url)
      setData(res.data.data ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const getById = useCallback(async (id: number): Promise<SleepRecord | undefined> => {
    setLoading(true)
    try {
      const res = await axios.get<ApiResponse<SleepRecord>>(`/api/sleep-records/${id}`)
      return res.data.data
    } catch (err: any) {
      setError(err.message)
      return undefined
    } finally {
      setLoading(false)
    }
  }, [])

  const createRecord = useCallback(async (body: Partial<SleepRecord>) => {
    const res = await axios.post<ApiResponse<SleepRecord>>('/api/sleep-records', body)
    const rec = res.data.data
    if (rec) setData(prev => [...prev, rec])
    return res.data.data
  }, [])

  const updateRecord = useCallback(async (id: number, body: Partial<SleepRecord>) => {
    const res = await axios.put<ApiResponse<SleepRecord>>(`/api/sleep-records/${id}`, body)
    const rec = res.data.data
    if (rec) {
      setData(prev => prev.map(r => (r.id === id ? rec : r)))
    }
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
    getById,
    updateRecord,
    deleteRecord,
    fetchAll,
    refresh: fetchAll
  }
}
