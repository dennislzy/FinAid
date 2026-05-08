/* eslint-disable */
'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import SearchBar from "@/app/case_overview/search_input";
import InsuranceTable from "../insuranceTable";
import { useCookies } from "react-cookie";
import { CaseInfoProps } from "@/type/common/common";
import { InsideBox } from "@/component/styles/outerBoxStyle";
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs"
export default function InsuranceOverview({ params }: CaseInfoProps) {
    const { caseInfoId } = params;
   

    if (!caseInfoId) {
        return <p>無法讀取 caseInfoId，請檢查網址</p>;
    }


    const insuranceLinks = [
        { href: "/", label: "個案總覽" },
        { href: `/insurance_overview/${caseInfoId}`, label: "保險明細" },
    ]


    return <>
        <FinAidBreadcrumbs title="保險明細" links={insuranceLinks} caseInfoId={caseInfoId} />
        <Box sx={InsideBox}>
          
            <InsuranceTable caseInfoId={caseInfoId}  />
        </Box>
    </>;
}



