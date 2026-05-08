// import { Dispatch, SetStateAction } from "react";
import { AidAssociationResponse, AllowancePurchaseResponse, BondResponse, FundInvestResponse, StockPurchaseResponse } from "../entity/entityType";

export interface CaseInfoProps {
    // page: number;
    // rowsPerPage: number;
    // setRowsPerPage: Dispatch<SetStateAction<number>>;
    // setPage: Dispatch<SetStateAction<number>>;
    params: {
      caseInfoId: string;
      fileId: number;
    };
    stocks?:StockPurchaseResponse[]
    fundList?:FundInvestResponse[]
    aidList?:AidAssociationResponse[]
    allowanceList?:AllowancePurchaseResponse[]
    bondList?:BondResponse[]
}

export interface FinancialTypeProps {
  params:{
    financialType:string;
    caseInfoId?:string
  }
}

export interface InsuranceProps {
  params: {
    caseInfoId: string;  // 保險需要的個案 ID
  };
}

export const refreshPage = () => {
  window.location.reload();
};