// src/routes/SleepRecordsPage.tsx
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSleepRecords } from '../hooks/useSleepRecords'
import SleepRecordList from '../components/sleep/SleepRecordList'
import Button from '../components/ui/Button'

export default function SleepRecordsPage() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const {
    data: records,
    loading,
    error,
    deleteRecord, // 훅에서 제공하는 삭제 함수
    fetchAll // 훅에서 제공하는 전체 조회 함수
  } = useSleepRecords(userId!)

  // 컴포넌트 마운트 시 전체 불러오기
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleEdit = (id: number) => {
    navigate(`/sleep-records/${id}/edit`)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('정말 이 기록을 삭제하시겠습니까?')) {
      await deleteRecord(id)
      fetchAll()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">수면 기록 목록</h1>
        <Link to="/sleep-records/new">
          <Button>새 기록 추가</Button>
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">로딩 중…</p>}
      {error && <p className="text-center text-red-500">에러: {error}</p>}
      {!loading && !error && records.length === 0 && (
        <p className="text-center text-gray-500">기록이 없습니다.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <SleepRecordList
          records={records}
          onEdit={r => handleEdit(r)}
          onDelete={r => handleDelete(r)}
        />
      )}
    </div>
  )
}
