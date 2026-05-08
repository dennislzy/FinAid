'use client'

import { useGetAssetQuery } from '@/redux/rtk/dashboardApi'
import { useCookies } from 'react-cookie'
import ChartTemplate from './chartTemplate'

interface AssetTypePieProps {
  caseInfoId: string
  year: number
}

const COLORS = ['#8884d8', '#82ca9d']

export default function AssetTypePie(props: AssetTypePieProps) {
  const { caseInfoId, year } = props
  const [cookies] = useCookies()
  const socialWorkerEmail = cookies.user

  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useGetAssetQuery(
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

  const chartData = [
    { name: '非流動資產', value: summary['非流動資產'] },
    { name: '流動資產', value: summary['流動資產'] },
  ]

  return <ChartTemplate title="資產類型" data={chartData} colors={COLORS} />
}
