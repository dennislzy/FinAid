'use client'
import { CaseInfoProps } from "@/type/common/common";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "@/component/text/loading";
import AllowanceArea from "./allowanceArea";
import { useGetAllAllowanceQuery } from "@/redux/rtk/allowanceApi";
import InvestmentTab, { investmentValue } from "@/component/report/tabs/InvestmentTab";
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs";
import { Box } from "@mui/material";
import { InsideBox } from "@/component/styles/outerBoxStyle";
import CustomTabs from "@/component/report/tabs/CustomTabInvestment";
import { Value } from '../../../../component/report/financialTabContent';

export default function AddCaseInvestment ({ params } : CaseInfoProps) {

  const [cookies]=useCookies()
  const caseInfoId=params.caseInfoId
  const {data:allowance}=useGetAllAllowanceQuery({
      socialWorkerEmail:cookies.user,
      caseInfoId:caseInfoId,
      
  })
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (allowance) {  // 只要 allowance 有資料，就設定為 true
      setIsDataLoaded(true);
      
    }
  }, [allowance]);
  

  if (!isDataLoaded) {
    return <Loading isAudioText={false} />; // 若資料尚未載入，顯示 Loading
  }

  const investmentLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/caseInvestment/${caseInfoId}/Allowance`, label: "其他明細" },
  ]

  return(
    <>
      <AllowanceArea params={params} allowanceList={allowance}  />
    </>
  )
}