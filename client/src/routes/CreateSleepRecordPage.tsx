// src/routes/CreateSleepRecordPage.tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import SleepRecordForm, { SleepRecordFormValues } from '../components/sleep/SleepRecordForm'
import { useSleepRecords } from '../hooks/useSleepRecords'

export default function CreateSleepRecordPage() {
  const navigate = useNavigate()
  const { userId } = useAuth() // 로그인한 유저 ID
  const { createRecord } = useSleepRecords(userId ?? undefined)

  const handleCreate = async (values: SleepRecordFormValues) => {
    if (!userId) {
      // 인증이 안 된 상태면 로그인 페이지로 이동
      return navigate('/login')
    }
    await createRecord({ userId, ...values })
    navigate('/sleep-records')
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
        <div className="px-6 py-4 bg-blue-600">
          <h2 className="text-xl font-semibold text-white">새 수면 기록 추가</h2>
        </div>
        <div className="px-6 py-6">
          <SleepRecordForm onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  )
}
