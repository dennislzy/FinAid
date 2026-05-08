/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import React from "react";
import BackToOverview from "../case/backToOverview";
import { SIDE_BAR_WIDTH } from "../sideBar/sideBarCss";
import SideBar from "../sideBar/sideBar";
import { sideMove } from "@/styledComponents/casestyled";
interface ReportStyleProps {
    title: string,
    dateSelect: React.ReactNode,
    content: React.ReactNode,
    caseInfoId: string | undefined
    location: number
}
export default function ReportStyle(reportStyle: ReportStyleProps) {
    const { title, dateSelect, content } = reportStyle
    return (
        <>


            {/* <SideBar caseInfoId={reportStyle.caseInfoId} location={reportStyle.location} /> */}
            <Box
                sx={{
                    // backgroundColor: "rgba(247, 247, 247, 0.6)",


                }}>
                {dateSelect}
                {content}
            </Box>

        </>
    )
}