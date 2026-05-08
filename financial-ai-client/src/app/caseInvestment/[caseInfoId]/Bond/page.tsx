'use client'

import { CaseInfoProps } from "@/type/common/common";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "@/component/text/loading";
import { useGetAllBondQuery } from "@/redux/rtk/bondApi";
import InvestmentTab from "@/component/report/tabs/InvestmentTab";
import BondArea from "./bondArea";

export default function AddCaseInvestment ({ params } : CaseInfoProps) {

  const [cookies]=useCookies()
  const caseInfoId=params.caseInfoId
  const {data:bond}=useGetAllBondQuery({
      socialWorkerEmail:cookies.user,
      caseInfoId:caseInfoId,
      
  })

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // 當資料已經加載並更新時，將 isDataLoaded 設為 true
    if (bond) {
      setIsDataLoaded(true);
    }
  }, [bond]); // 監控 allowance 的變化，當資料更新時，設定 isDataLoaded 為 true

  if (!isDataLoaded) {
    return <Loading isAudioText={false} />; // 若資料尚未載入，顯示 Loading
  }

  return(
    <>
      <BondArea params={params} bondList={bond}/>
    </>
  )
}