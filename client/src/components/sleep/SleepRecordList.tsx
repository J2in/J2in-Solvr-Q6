import { SleepRecord } from '../../types/sleepRecord'
import { format, parseISO } from 'date-fns'
import Button from '../ui/Button'

interface Props {
  records: SleepRecord[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function SleepRecordList({ records, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {records.map(record => {
        const start = parseISO(record.startTime)
        const end = parseISO(record.endTime)
        return (
          <div
            key={record.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded shadow"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-4 w-full">
              <div>
                <div className="text-sm text-gray-500">날짜</div>
                <div className="font-medium">{format(start, 'yyyy-MM-dd')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">시작</div>
                <div className="font-medium">{format(start, 'HH:mm')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">종료</div>
                <div className="font-medium">{format(end, 'HH:mm')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">총 수면</div>
                <div className="font-medium">{record.durationMinutes}분</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">품질</div>
                <div className="font-medium">{record.quality} / 5</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">메모</div>
                <div className="font-medium break-words">{record.notes || '-'}</div>
              </div>
            </div>
            <div>
              <Button onClick={() => onEdit(record.id)} className="px-3 py-1">
                수정
              </Button>
              <Button onClick={() => onDelete(record.id)} className="ml-2 px-3 py-1">
                삭제
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
