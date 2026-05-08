import { Box } from "@mui/material"
import { categoryConfig } from "../../app/month_overview/optionList"

export type Value = "收入" | "支出" | "資產" | "負債"

export interface MonthlyCase {
  caseInfoId: number
  financialType: string
  financialCategory: string
  money: number
  years: number
  monthly: number
}

const FinancialTabContent = ({
  value,
  selectedYear,
  selectedMonth,
  caseInfoId,
}: {
  value: Value
  selectedYear: number | null
  selectedMonth: number | null
  caseInfoId: string
}) => {
  const config = categoryConfig[value]
  if (!config) return null

  const { Component } = config

  return (
    <Box>
      <Component
        financialType={value}
        year={selectedYear as number}
        monthly={selectedMonth as number}
        caseInfoId={caseInfoId}
      />
    </Box>
  )
}

export default FinancialTabContent

