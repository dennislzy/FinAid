/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import type { Value } from "@/component/report/financialTabContent"
import FinancialTabYearContent from "@/component/report/financialTabYearContent"
import ReportStyle from "@/component/report/reportStyle"
import CustomTabs from "@/component/report/tabs/CustomTab"
import type { FinancialTypeProps } from "@/type/common/common"
import { Box } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import GroupedSelect2 from "../../../component/report/select2"
import CashDialogYear from "../../../component/report/CashDialogYear"
import { categoryConfig } from "./optionList"
import { InsideBox } from "@/component/styles/outerBoxStyle"
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs"
import StatisticPage from "@/app/statistic/yearSummaryChart/page"
import StatisticPage2 from "@/app/statistic/yearSummaryChart2/page"

const YearResult = ({ params }: FinancialTypeProps) => {
  const caseInfoId = params.caseInfoId
  const searchParms = useSearchParams()
  const financialTypeParams = (searchParms.get("financialType") as Value) || "收入"

  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [value, setValue] = useState<Value>(financialTypeParams)
  const router = useRouter()

  // 當 URL 參數變化時更新 value
  useEffect(() => {
    if (financialTypeParams) {
      setValue(financialTypeParams)
    }
  }, [financialTypeParams])

  const handleChange = (event: React.SyntheticEvent, newValue: Value) => {
    setValue(newValue)
    router.push(`/year_overview/${caseInfoId}?financialType=${newValue}`)
  }

  const yearOptions = [
    {
      groupLabel: "年份",
      items: [
        { value: 2025, label: "2025" },
        { value: 2024, label: "2024" },
        { value: 2023, label: "2023" },
        { value: 2022, label: "2022" },
        { value: 2021, label: "2021" },
      ],
    },
  ]

  const yearLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/year_overview/${caseInfoId}?financialType=收入`, label: "每年收支" },
  ]

  // 獲取當前選中標籤的配置
  const config = categoryConfig[value]
  const { financialCategory, options } = config || { financialCategory: "", options: [] }

  // 判斷是否顯示年份選擇框
  const shouldShowYearSelect = (value as string) !== "收支統計" && (value as string) !== "資產負債統計"

  const dateSelect = (
    <>
      <CustomTabs value={value} onChange={handleChange} />

      {/* 僅當選擇非「統計」tab時顯示年份選擇框 */}
      {shouldShowYearSelect && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2, marginTop: 1, marginBottom: 1 }}>
          <GroupedSelect2
            options={yearOptions}
            value={selectedYear || ""}
            onChange={(newValue) => setSelectedYear(Number(newValue))}
            placeholder="年份"
            label="年份"
            id="year-select"
          />

          {config && (
            <CashDialogYear
              caseInfoId={caseInfoId as string}
              financialType={value}
              financialCategory={financialCategory}
              options={options}
              selectedYear={selectedYear}
            />
          )}
        </Box>
      )}
    </>
  )

  // 根據選擇的 Tab 顯示內容
const content = (
  <>
    {(value as string) === "收支統計" ? (
      <StatisticPage caseInfoId={caseInfoId} />  // 如果選中「收支統計」tab，顯示 StatisticPage
    ) : (value as string) === "資產負債統計" ? (
      <StatisticPage2 caseInfoId={caseInfoId} />  // 如果選中「資產負債統計」tab，顯示 StatisticPage2
    ) : (
      <FinancialTabYearContent value={value} caseInfoId={caseInfoId as string} selectedYear={selectedYear} />
    )}
  </>
)


  return <>
    <FinAidBreadcrumbs title="每年收支" links={yearLinks} caseInfoId={caseInfoId} />
    <Box sx={InsideBox}>
      <ReportStyle title="年份" dateSelect={dateSelect} content={content} caseInfoId={caseInfoId} location={1} />
    </Box>
  </>
}

export default YearResult

