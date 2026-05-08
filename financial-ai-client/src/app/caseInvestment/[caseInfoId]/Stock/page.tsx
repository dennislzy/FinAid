'use client'

import { useGetAllStocksQuery } from "@/redux/rtk/stockApi";
import { CaseInfoProps } from "@/type/common/common";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import StockArea from "./stockArea";
import Loading from "@/component/text/loading";
import InvestmentTab from "@/component/report/tabs/InvestmentTab";

export default function AddCaseInvestment ({ params } : CaseInfoProps) {

  const [cookies]=useCookies()
  const caseInfoId=params.caseInfoId
  const {data:stocks}=useGetAllStocksQuery({
      socialWorkerEmail:cookies.user,
      caseInfoId:caseInfoId,

  })

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // 當資料已經加載並更新時，將 isDataLoaded 設為 true
    if (stocks) {
      setIsDataLoaded(true);
    }
  }, [stocks]); // 監控 stocks 的變化，當資料更新時，設定 isDataLoaded 為 true

  if (!isDataLoaded) {
    return <Loading isAudioText={false} />; // 若資料尚未載入，顯示 Loading
  }
  return(
    <>    
      <StockArea params={params} stocks={stocks}/>
    </>
  )
}