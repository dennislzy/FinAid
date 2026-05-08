/* eslint-disable */
'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import SearchBar from "@/app/case_overview/search_input";
import InsuranceTable from "../familyTable";
import { useCookies } from "react-cookie";
import { CaseInfoProps } from "@/type/common/common";
import { InsideBox } from "@/component/styles/outerBoxStyle";
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs"
import FamilyTable from "../familyTable";
export default function InsuranceOverview({ params }: CaseInfoProps) {
    const { caseInfoId } = params;
   

    if (!caseInfoId) {
        return <p>無法讀取 caseInfoId，請檢查網址</p>;
    }


    const familyLinks = [
        { href: "/", label: "個案總覽" },
        { href: `/family/${caseInfoId}`, label: "家庭狀況" },
    ]


    return <>
        <FinAidBreadcrumbs title="家庭狀況" links={familyLinks} caseInfoId={caseInfoId} />
        <Box sx={InsideBox}>
        
            <FamilyTable caseInfoId={caseInfoId}  />
        </Box>
    </>;
}



