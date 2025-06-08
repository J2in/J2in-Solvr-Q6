import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

interface StatRecord {
  period: string
  count: number
}

interface Props {
  data: StatRecord[]
}

export default function SleepTrendByMonth({ data }: Props) {
  // 분 → "Xh Ym" 포맷으로 변환
  const formatMinutes = (value: number) => {
    const h = Math.floor(value / 60)
    const m = value % 60
    return `${h}h ${m}m`
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          tickFormatter={formatMinutes}
          label={{ value: '수면 시간', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value: number) => formatMinutes(value as number)}
          labelFormatter={label => `날짜: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="totalMinutes"
          stroke="#4f46e5"
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
