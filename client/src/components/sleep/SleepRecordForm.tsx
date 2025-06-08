import React, { useState, useEffect } from 'react'
import { SleepRecord } from '../../hooks/useSleepRecords'
import Button from '../ui/Button'

export type SleepRecordFormValues = Pick<SleepRecord, 'startTime' | 'endTime' | 'quality' | 'notes'>

interface Props {
  initialValues?: SleepRecordFormValues
  onSubmit: (values: SleepRecordFormValues) => Promise<void>
}

export default function SleepRecordForm({ initialValues, onSubmit }: Props) {
  // 기본값: 현재 시각 (YYYY-MM-DDThh:mm)
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

  // 시작<->종료 시간 검증
  useEffect(() => {
    if (form.endTime < form.startTime) {
      setTimeError('종료 시간이 시작 시간보다 이전일 수 없습니다.')
    } else {
      setTimeError(null)
    }
  }, [form.startTime, form.endTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: name === 'quality' ? +value : value
    }))
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
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {timeError && <p style={{ color: 'red' }}>{timeError}</p>}

      <label>
        수면 시작
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          max={form.endTime} // 시작은 종료 이전까지만 선택 가능
          required
        />
      </label>

      <label>
        수면 종료
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          min={form.startTime} // 종료는 시작 이후부터 선택 가능
          required
        />
      </label>

      <label>
        품질 (1–5)
        <input
          type="number"
          name="quality"
          min={1}
          max={5}
          value={form.quality}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        메모
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
      </label>

      <Button type="submit" disabled={submitting || !!timeError}>
        {submitting ? '저장 중…' : '저장'}
      </Button>
    </form>
  )
}
