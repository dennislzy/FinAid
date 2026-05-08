import { Box } from "@mui/material"
import { categoryConfig } from "../../app/year_overview/[caseInfoId]/optionList"
import type { Value } from "./financialTabContent"

const FinancialTabYearContent = ({
  value,
  caseInfoId,
  selectedYear,
}: {
  value: Value
  caseInfoId: string
  selectedYear: number
}) => {
  const config = categoryConfig[value]
  if (!config) return null

  const { Component } = config

  return (
    <Box>
      <Component caseInfoId={caseInfoId} financialType={value} year={selectedYear} />
    </Box>
  )
}
export default FinancialTabYearContent

