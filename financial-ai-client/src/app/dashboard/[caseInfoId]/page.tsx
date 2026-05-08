'use client'

import { yearOptions } from "@/app/month_overview/optionList"
import GroupedSelect2 from "@/component/report/select2"
import { InsideBox } from "@/component/styles/outerBoxStyle"
import { CaseInfoProps } from "@/type/common/common"
import { Box, Button } from "@mui/material"
import { useState } from "react"
import { useCookies } from "react-cookie"
import AssetTypePie from "./Chart/assetTypePie"
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs"
import AssetPie from "./Chart/assetPie"
import LiabilityPie from "./Chart/liabilityPie"
import MonthlyBalanceChart from "./Chart/monthlyBalanceChart"
import OtherDetailBarChart from "./Chart/otherDetailBarChart"
import AllInsurentBarChart from "./Chart/allInsurentBarChart"
import RiskComment from "./risk_welfare/riskComment"
import CaseLight from "./risk_welfare/caseLight"
import SubsidySuggest from "./risk_welfare/subsidySuggest"
import RiskWelfareDialog from "./risk_welfare/risk_welfareDialog"
export default function DashBoard({ params }: CaseInfoProps) {
    const caseInfoId = params.caseInfoId
    const [selectedYear, setSelectedYear] = useState<number>(2025)
    const [riskwelfareDialogoOpen, setRiskwelfareDialogoOpen] = useState(false)
    const dashboardLinks = [
        { href: "/", label: "個案總覽" },
        { href: `/dashboard/${caseInfoId}`, label: "儀表板" },
    ]

    const PCstyle = {
        flex: "1 1 330px", // 每張圖最小寬度 350px
        maxWidth: "400px",
        height: 420,
    }


    return (
        <>
            <FinAidBreadcrumbs title="儀表板" links={dashboardLinks} caseInfoId={caseInfoId} />
            <Box sx={{ mb: 2, px: 0, py: 1 }}>
                {/* <RiskComment caseInfoId={caseInfoId} /> */}
                <Button
                    onClick={() => setRiskwelfareDialogoOpen(true)}
                >
                    風險評估與補助建議
                </Button>
                <RiskWelfareDialog open={riskwelfareDialogoOpen} onClose={() => setRiskwelfareDialogoOpen(false)} caseInfoId={caseInfoId} year={selectedYear} />
            </Box>
            <br />

            <Box sx={InsideBox}>

                {/* 選擇年分 */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 2,
                        marginTop: 1,
                        marginBottom: 1,
                    }}
                >
                    <GroupedSelect2
                        options={yearOptions}
                        value={selectedYear || ""}
                        onChange={(newValue) => setSelectedYear(Number(newValue))}
                        placeholder="年份"
                        label="年份"
                        id="year-select"
                    />
                </Box>

                {/* 紅綠燈與按鈕區塊 */}
                {/* <Box
                    sx={{
                        marginLeft: 4,
                        marginRight: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <CaseLight caseInfoId={caseInfoId} year={selectedYear} />
                    <SubsidySuggest caseInfoId={caseInfoId} year={selectedYear} />
                </Box> */}

                {/* 三個圓餅圖橫排區塊 */}
                <Box sx={{
                    display: "flex",
                    gap: 3,
                    justifyContent: "center",
                    flexWrap: "wrap", // 如果螢幕太小自動換行
                    mb: 8, // 下方 margin
                }}>
                    <Box sx={PCstyle}>
                        <AssetTypePie caseInfoId={caseInfoId} year={selectedYear} />
                    </Box>
                    <Box sx={PCstyle}>
                        <AssetPie caseInfoId={caseInfoId} year={selectedYear} />
                    </Box>
                    <Box sx={PCstyle}>
                        <LiabilityPie caseInfoId={caseInfoId} year={selectedYear} />
                    </Box>
                </Box>


                {/* 月結餘圖 */}
                <Box sx={{ px: 2, pb: 2 }}>
                    <MonthlyBalanceChart
                        year={selectedYear}
                        caseInfoId={caseInfoId}
                    />
                </Box>


                {/* 其它明細長條圖 */}
                <Box sx={{ px: 2, pb: 2 }}>
                    <OtherDetailBarChart
                        year={selectedYear}
                        caseInfoId={caseInfoId}
                    />
                </Box>

                {/* 保險長條圖 */}
                <Box sx={{ px: 2, pb: 2 }}>
                    <AllInsurentBarChart
                        year={selectedYear}
                        caseInfoId={caseInfoId}
                    />
                </Box>

            </Box>
        </>
    )
}
