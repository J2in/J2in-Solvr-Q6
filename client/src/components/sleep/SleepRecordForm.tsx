// src/components/sleep/SleepRecordForm.tsx
import React, { useState, useEffect } from 'react'
import { SleepRecord } from '../../hooks/useSleepRecords'
import Button from '../ui/Button'

export type SleepRecordFormValues = Pick<SleepRecord, 'startTime' | 'endTime' | 'quality' | 'notes'>

interface Props {
  initialValues?: SleepRecordFormValues
  onSubmit: (values: SleepRecordFormValues) => Promise<void>
}

export default function SleepRecordForm({ initialValues, onSubmit }: Props) {
  const nowIso = new Date().toISOString().slice(0, 16)
  const [form, setForm] = useState<SleepRecordFormValues>({
    startTime: initialValues?.startTime ?? nowIso,
    endTime: initialValues?.endTime ?? nowIso,
    quality: initialValues?.quality ?? 3,
    notes: initialValues?.notes ?? ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeError, setTimeError] = useState<string | null>(null)

  // 시작/종료 시간 검증
  useEffect(() => {
    setTimeError(
      form.endTime < form.startTime ? '종료 시간이 시작 시간보다 이전일 수 없습니다.' : null
    )
  }, [form.startTime, form.endTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'quality' ? +value : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (timeError) return
    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || timeError) && <p className="text-sm text-red-600">{error || timeError}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">수면 시작</label>
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          max={form.endTime}
          required
          className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">수면 종료</label>
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          min={form.startTime}
          required
          className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">품질 (1–5)</label>
        <input
          type="number"
          name="quality"
          min={1}
          max={5}
          value={form.quality}
          onChange={handleChange}
          required
          className="mt-1 block w-24 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">메모</label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="text-right">
        <Button type="submit" disabled={submitting || !!timeError}>
          {submitting ? '저장 중…' : '저장'}
        </Button>
      </div>
    </form>
  )
}
