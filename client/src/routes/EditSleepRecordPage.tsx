import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SleepRecordForm, { SleepRecordFormValues } from '../components/sleep/SleepRecordForm'
import { useSleepRecords } from '../hooks/useSleepRecords'

export default function EditSleepRecordPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getById, updateRecord } = useSleepRecords()
  const [initial, setInitial] = useState<SleepRecordFormValues | null>(null)

  // 컴포넌트 마운트 시 단일 레코드만 불러오기
  useEffect(() => {
    if (!id) return
    getById(+id).then(rec => {
      if (rec) {
        setInitial({
          startTime: rec.startTime.slice(0, 16),
          endTime: rec.endTime.slice(0, 16),
          quality: rec.quality,
          notes: rec.notes || ''
        })
      } else {
        // 없는 ID면 리스트로 리다이렉트
        navigate('/sleep-records')
      }
    })
  }, [id, getById, navigate])

  const handleUpdate = async (values: SleepRecordFormValues) => {
    await updateRecord(+id!, values)
    navigate('/sleep-records')
  }

  if (!initial) {
    return <p>로딩 중…</p>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>수면 기록 수정</h1>
      <SleepRecordForm initialValues={initial} onSubmit={handleUpdate} />
    </div>
  )
}
