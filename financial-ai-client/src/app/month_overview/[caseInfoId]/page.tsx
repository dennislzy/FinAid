/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import FinancialTabContent, { type Value } from "@/component/report/financialTabContent"
import ReportStyle from "@/component/report/reportStyle"
import CustomTabs from "@/component/report/tabs/CustomTabMonth"
import type { FinancialTypeProps } from "@/type/common/common"
import { Box } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import GroupedSelect2 from "../../../component/report/select2"
import { monthOptions, yearOptions } from "../optionList"
import CashDialog from "@/component/report/CashDialog"
import { categoryConfig } from "../optionList"
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs"
import { InsideBox } from "@/component/styles/outerBoxStyle"
import MonthlySummaryPage from "@/app/statistic/monthlySummaryChart/page"
const YearResult = (params: FinancialTypeProps) => {
  const caseInfoId = params.params.caseInfoId
  const searchParms = useSearchParams()
  const financialTypeParams = (searchParms.get("financialType") as Value) || "收入"

  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [selectedMonth, setSelectedMonth] = useState<number>(1)
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
    router.push(`/month_overview/${caseInfoId}?financialType=${newValue}`)
  }

  const monthLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/month_overview/${caseInfoId}?financialType=收入`, label: "每月收支" },
  ]

  // 獲取當前選中標籤的配置
  const config = categoryConfig[value]
  const { options } = config || { options: [] }

   // 判斷是否顯示年份與月份選擇框
   const shouldShowDateSelect = (value as string) !== "統計"

   const dateSelected = (
     <>
       <CustomTabs value={value} onChange={handleChange} />
       {shouldShowDateSelect && (
         <Box sx={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "space-between", padding: 2, marginTop: 1, marginBottom: 1 }}>
           <GroupedSelect2
             options={yearOptions}
             value={selectedYear || ""}
             onChange={(newValue) => setSelectedYear(Number(newValue))}
             placeholder="年份"
             label="年份"
             id="year-select"
           />
           <GroupedSelect2
             options={monthOptions}
             value={selectedMonth || ""}
             onChange={(newValue) => setSelectedMonth(Number(newValue))}
             placeholder="月份"
             label="月份"
             id="month-select"
           />
 
           <Box sx={{ marginLeft: "auto" }}>
             {config && (
               <CashDialog
                 financialCategory={value}
                 options={options}
                 selectedYear={selectedYear}
                 selectedMonth={selectedMonth}
                 caseInfoId={caseInfoId as string}
                 financialType={value}
               />
             )}
           </Box>
         </Box>
       )}
     </>
   )
 
   const content = (
     <>
       {(value as string) === "統計" ? (
         <MonthlySummaryPage caseInfoId={caseInfoId} year={selectedYear} setYear={setSelectedYear} />  // 顯示 MonthlySummaryPage 組件
       ) : (
         <FinancialTabContent
           value={value}
           selectedYear={selectedYear}
           selectedMonth={selectedMonth}
           caseInfoId={caseInfoId as string}
         />
       )}
     </>
   )

  return <>
    <FinAidBreadcrumbs title="每月收支" links={monthLinks} caseInfoId={caseInfoId} />
    <Box sx={InsideBox}>
      <ReportStyle
        title="年份與月份"
        content={content}
        dateSelect={dateSelected}
        caseInfoId={caseInfoId}
        location={2}
      />
    </Box>
  </>
}

export default YearResult

