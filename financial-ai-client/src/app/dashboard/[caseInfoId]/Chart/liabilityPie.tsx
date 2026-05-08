'use client'

import { useGetAllLiabilityQuery } from '@/redux/rtk/dashboardApi'
import { useCookies } from 'react-cookie'
import ChartTemplate from './chartTemplate'

interface LiabilityProps {
  caseInfoId: string
  year: number
}

const COLORS = ['#8884d8', '#82ca9d', '#ff8042', '#ffbb28', '#8e44ad', '#e74c3c', '#1abc9c', '#f39c12']

export default function LiabilityPie(props: LiabilityProps) {
  const { caseInfoId, year } = props
  const [cookies] = useCookies()
  const socialWorkerEmail = cookies.user

  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useGetAllLiabilityQuery(
    {
      socialWorkerEmail,
      caseInfoId,
      year,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  if (isLoading) return <div>載入中...</div>
  if (isError) return <div>發生錯誤：{String(error)}</div>
  if (!summary) return <div>無資料</div>

  const chartData = Object.entries(summary)
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({
      name: key,
      value,
    }))

  return <ChartTemplate title="負債分布" data={chartData} colors={COLORS} />
}
