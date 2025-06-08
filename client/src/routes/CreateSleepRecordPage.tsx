import { useNavigate } from 'react-router-dom'
import SleepRecordForm, { SleepRecordFormValues } from '../components/sleep/SleepRecordForm'
import { useSleepRecords } from '../hooks/useSleepRecords'

export default function CreateSleepRecordPage() {
  const navigate = useNavigate()
  const { createRecord } = useSleepRecords()

  const handleCreate = async (values: SleepRecordFormValues) => {
    await createRecord({
      userId: 1, // TODO: 실제 로그인한 유저 ID로 대체
      ...values
    })
    navigate('/sleep-records')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>새 수면 기록 추가</h1>
      <SleepRecordForm onSubmit={handleCreate} />
    </div>
  )
}
