import { SleepRecord } from '../../types/sleepRecord' // adjust import path if needed
import { format, parseISO } from 'date-fns'

interface SleepRecordListProps {
  records: SleepRecord[]
  onEdit: (record: SleepRecord) => void
  onDelete: (record: SleepRecord) => void
}

export default function SleepRecordList({ records, onEdit, onDelete }: SleepRecordListProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>날짜</th>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>시작 시간</th>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>종료 시간</th>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>총 수면(분)</th>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>품질(1-5)</th>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>메모</th>
          <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>동작</th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => {
          const start = parseISO(record.startTime)
          const end = parseISO(record.endTime)
          return (
            <tr key={record.id}>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                {format(start, 'yyyy-MM-dd')}
              </td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                {format(start, 'HH:mm')}
              </td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                {format(end, 'HH:mm')}
              </td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                {record.durationMinutes}
              </td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                {record.quality}
              </td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                {record.notes || '-'}
              </td>
              <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>
                <button onClick={() => onEdit(record)} style={{ marginRight: 8 }}>
                  수정
                </button>
                <button onClick={() => onDelete(record)}>삭제</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
