'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useEffect, useState } from 'react'

interface ChartTemplateProps {
  data: { name: string; value: number }[]
  colors: string[]
  title: string // 新增 title 屬性
}

export default function ChartTemplate({ data, colors, title }: ChartTemplateProps) {
  const [displayData, setDisplayData] = useState(data)
  const [chartKey, setChartKey] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    setDisplayData(data)
    setChartKey((prev) => prev + 1) // 用來強制 PieChart 重新渲染以觸發動畫
  }, [data])

  const total = displayData.reduce((acc, item) => acc + item.value, 0)
  const hasData = total > 0
  const chartData = hasData ? displayData : [{ name: '無資料', value: 1 }]
  const chartColors = hasData ? colors : ['#949494']

  const displayText = hasData && activeIndex !== null
    ? {
        title: ((chartData[activeIndex].value / total) * 100).toFixed(1) + '%',
        subtitle: `${chartData[activeIndex].value.toLocaleString()} 元`,
      }
    : hasData
    ? {
        title: '100%',
        subtitle: `${total.toLocaleString()} 元`,
      }
    : {
        title: '0',
        subtitle: '0 元',
      }

  return (
    <div style={{ width: '100%', height: 350, position: 'relative' }}>
      <h3 style={{marginLeft: 10}}>{title}</h3> {/* 顯示圖表名稱 */}
      <ResponsiveContainer>
        <PieChart key={chartKey}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            isAnimationActive={true}
            onMouseEnter={(_, index) => hasData && setActiveIndex(index)}
            onMouseLeave={() => hasData && setActiveIndex(null)}
            label={({ cx, cy }) =>
              displayText && (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="1.2rem"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {displayText.title}
                  <tspan
                    x={cx}
                    dy="1.2rem"
                    fontSize="1rem"
                    fontWeight="normal"
                  >
                    {displayText.subtitle}
                  </tspan>
                </text>
              )
            }
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              if (!hasData) return [0, name]
              return [`${value.toLocaleString()} 元`, name]
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => {
              if (!hasData && value === '無資料') {
                return `${value}：0 元`
              }
              const matchedItem = chartData.find((item) => item.name === value)
              return `${value}：${matchedItem?.value.toLocaleString()} 元`
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
