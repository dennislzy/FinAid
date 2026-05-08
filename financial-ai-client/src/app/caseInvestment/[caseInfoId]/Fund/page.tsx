'use client'
import { useGetAllFundsQuery } from "@/redux/rtk/fundApi";
import { CaseInfoProps } from "@/type/common/common";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import FundArea from "./fundArea";
import Loading from "@/component/text/loading";
import InvestmentTab from "@/component/report/tabs/InvestmentTab";


export default function AddCaseFund ({ params } : CaseInfoProps) {
 
  const caseInfoId = params.caseInfoId
  const [cookies] = useCookies()
  const {data:fundsList}=useGetAllFundsQuery({
      socialWorkerEmail:cookies.user,
      caseInfoId:caseInfoId,
     
  })

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // 當資料已經加載並更新時，將 isDataLoaded 設為 true
    if (fundsList) {
      setIsDataLoaded(true);
    }
  }, [fundsList]); // 監控 fundsList 的變化，當資料更新時，設定 isDataLoaded 為 true

  if (!isDataLoaded) {
    return <Loading isAudioText={false} />; // 若資料尚未載入，顯示 Loading
  }
  return(
    <>
      <FundArea fundList={fundsList} params={params}/>
    </>
  )
}