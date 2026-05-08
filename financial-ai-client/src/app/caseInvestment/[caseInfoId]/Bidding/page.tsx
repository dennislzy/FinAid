'use client'
import { useGetAidQuery } from "@/redux/rtk/aidApi";
import { CaseInfoProps } from "@/type/common/common";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import BiddingArea from "./biddingArea";
import Loading from "@/component/text/loading";
import InvestmentTab from "@/component/report/tabs/InvestmentTab";

export default function AddCaseInvestment ({ params } : CaseInfoProps) {
 
  const caseInfoId = params.caseInfoId
  const [cookies]=useCookies()
  const {data:aidList}=useGetAidQuery({
      socialWorkerEmail:cookies.user,
      caseInfoId:caseInfoId,
      
  })

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // 當資料已經加載並更新時，將 isDataLoaded 設為 true
    if (aidList) {
      setIsDataLoaded(true);
    }
  }, [aidList]); // 監控 aidList 的變化，當資料更新時，設定 isDataLoaded 為 true

  if (!isDataLoaded) {
    return <Loading isAudioText={false} />; // 若資料尚未載入，顯示 Loading
  }
  return(
    <>
      <BiddingArea aidList={aidList} params={params}/>
    </>
  )
}