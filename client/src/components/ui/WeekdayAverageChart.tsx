import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface StatRecord {
  period: string
  count: number
}

interface Props {
  data: StatRecord[]
}

const WEEKDAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

export default function WeekdayAverageChart({ data }: Props) {
  const formatMinutes = (value: number) => {
    const h = Math.floor(value / 60)
    const m = Math.floor(value / 60)
    return `${h}h ${m}m`
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weekday" tickFormatter={w => WEEKDAYS_KR[w as number]} />
        <YAxis tickFormatter={formatMinutes} />
        <Tooltip
          formatter={(value: number) => formatMinutes(value as number)}
          labelFormatter={() => ''}
        />
        <Bar
          dataKey="avgMinutes"
          // 주말(0,6)만 파랑, 나머지 회색
          fill="#3b82f6"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
