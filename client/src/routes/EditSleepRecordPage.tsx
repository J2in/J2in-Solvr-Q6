import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SleepRecordForm, { SleepRecordFormValues } from '../components/sleep/SleepRecordForm'
import { useSleepRecords } from '../hooks/useSleepRecords'

export default function EditSleepRecordPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: records, updateRecord, fetchAll } = useSleepRecords()
  const [initial, setInitial] = useState<SleepRecordFormValues | null>(null)

  useEffect(() => {
    fetchAll().then(() => {
      const rec = records.find(r => r.id === +id!)
      if (rec) {
        setInitial({
          startTime: rec.startTime.slice(0, 16),
          endTime: rec.endTime.slice(0, 16),
          quality: rec.quality,
          notes: rec.notes || ''
        })
      }
    })
  }, [id, fetchAll, records])

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
