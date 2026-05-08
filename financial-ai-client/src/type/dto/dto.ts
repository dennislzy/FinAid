export type SocialWorkerLoginRequest = {
    socialWorkerEmail: string; // 對應 @NotNull
    socialWorkerPassword: string; // 對應 @NotBlank
};


export type SocialWorkerRegisterRequest = {
  socialWorkerEmail: string; // 對應 @NotNull
  socialWorkerPassword: string; // 對應 @NotBlank
  socialWorkerName: string;
  socialWorkerPermission: string
};


export type CaseInfoInsertRequest = {
    caseInfoName: string; // 案例名稱，不能為空
    caseInfoEnglishName: string; // 案例英文名稱，不能為空
    caseInfoGender: string; // 案例性別，不能為 null
    caseInfoLiveStatus: string; // 案例居住狀態，不能為 null
    caseInfoBirth: Date; // 案例生日，不能為 null
    caseInfoAddress: string; // 案例地址，不能為空
    caseInfoCity: string; // 案例所在城市，不能為空
    caseInfoPostCode: string; // 案例郵遞區號，不能為空
    caseInfoEmail: string; // 案例電子郵件，格式須符合 email 標準，不能為空
    caseInfoPhone: string; // 案例電話，不能為空
    caseInfoIdentification: string; // 案例身份證，不能為空
    caseInfoEmergencyContact: string; // 緊急聯絡人姓名，不能為空
    caseInfoEmergencyPhone: string; // 緊急聯絡電話，不能為空
    caseInfoEmergencyRelate: string; // 與緊急聯絡人的關係，不能為空
    caseInfoHomePhone: string; // 案例家中電話，不能為空
    caseInfoImage:string
    caseInfoCareer:string
    caseInfoHouseholdRegisterTime:string; // 設籍時間
    isWelfareIdentityProof:string; // 是否有福利身分證明
    isIndigenousOrNewResident:string; // 是否為原住民或新住民
    isDisability:string; // 是否有身障
    employmentType:string; // 收入穩定度
    stableMonths:number; // 收入持續月份
  };

  export interface CaseInfoUpdateRequest {
    caseInfoName?: string;
    caseInfoEnglishName?: string;
    caseInfoGender?: string; // 轉換為 string 類型
    caseInfoLiveStatus?: string; // 轉換為 string 類型
    caseInfoBirth?: Date;
    caseInfoAddress?: string;
    caseInfoCity?: string;
    caseInfoPostCode?: string;
    caseInfoEmail?: string; // 用 string 表示 @Email
    caseInfoPhone?: string;
    caseInfoIdentification?: string;
    caseInfoEmergencyContact?: string;
    caseInfoEmergencyPhone?: string;
    caseInfoEmergencyRelate?: string;
    caseInfoHomePhone?: string;
    caseInfoCareer:string
    caseInfoHouseholdRegisterTime:Date; // 設籍時間
    isWelfareIdentityProof:string; // 是否有福利身分證明
    isIndigenousOrNewResident:string; // 是否為原住民或新住民
    isDisability:string; // 是否有身障
    employmentType:string; // 收入穩定度
    stableMonths:number; // 收入持續月份
}

export interface Result<T>{
  total:number,
  rows:T[],
  totalPages:number
}

export interface FilterObject {
  page?: number;
  size?: number;
  query?: string;
  order?:string;
  sortBy?:string
}

export interface CaseUrlRequest {
  socialWorkerEmail: string,
  caseInfoId?: string
}
export interface YearNeed{
  year: number,
}

export interface StockPurchaseInsertRequest {
  shares: number;
  averageBuyPrice: number;
  stockCode: string;
};

export interface AllowancePurchaseInsertRequest {
  money: number 
  subsidyName: string 
  applyTime: Date
  receiveTime: Date
};

export interface BondInsertRequest {
  money: number 
  bondName: string 
  companyName: string 
  applyTime: Date
};

export interface StockPurchaseUpdateRequest {
  shares: number;
  averageBuyPrice: number;
};

export type FundInvestInsertRequest = {
  fundName: string; // 基金名稱，必填
  issuer: string; // 發行者，必填
  investmentMethod: string; // 投資方式，必填
  investmentAmount: number; // 投資金額，必須大於等於 0
  isForeign: string; // 是否為外幣投資，必填
  fundPurchaseDate: string; // 購買日期，必填
};

export type FundUpdateRequest = {
  issuer?: string; // 發行者，可選
  investmentMethod?: string; // 投資方式，可選
  investmentAmount?: number; // 投資金額，可選
  isForeign?: string; // 是否為外幣投資，可選
};

export type HouseholdYearFinancialRecordsInsertRequest = {
  financialCategory: string;
  financialType: string;
  money: number;
  year: number;
};

export type HouseholdYearFinancialRecordsUpdateRequest = {
  financialCategory: string;
  financialType: string;
  money: number;
  year: number;
};

export type AidAssociationInsertRequest= {
  isDead: string; // 活會或死會狀態（必填）
  monthlyAmount: number; // 每會金額（必填，且需為 0 或正數）
  period: number; // 當前期數（必填，且需大於等於 1）
  startDate?: Date; // 開始日期（可選）
  endDate?: Date; // 結束日期（可選）
  baseBidAmount?: number; // 底標金額（可選，且需為 0 或正數）
  monthlyExtraBid?: number; // 月外標（可選，且需為 0 或正數）
  other?: number; // 其他（可選）
};

export type AidAssociationUpdateRequest = {
  isDead?: string; // 活會或死會狀態（可選）
  monthlyAmount?: number; // 每會金額（可選，且需為 0 或正數）
  period?: number; // 當前期數（可選，且需大於等於 1）
  endDate?: Date; // 結束日期（可選）
  baseBidAmount?: number; // 底標金額（可選，且需為 0 或正數）
  monthlyExtraBid?: number; // 月外標（可選，且需為 0 或正數）
  other?: number; // 其他（可選）
};

export type DeleteMessage={
  message:string
}

export type InsuranceListInsertRequest = {
  insuranceType: string;
  familyMember: string;
  amount: number;
  annualPremium: number;
  insuranceCompanyName: string
};

export type InsuranceListUpdateRequest = {
  insuranceType: string;
  amount: number;
  annualPremium: number;
  insuranceCompanyName: string
};

export type FamilyMemberInsertRequest = {
  name: string;
  relationshipToCase: string;
  income: boolean;
  yearSalary?: number;
  supported: boolean;
}

export type FamilyMemberUpdateRequest = {
  name: string;
  relationshipToCase: string;
  income: boolean;
  yearSalary?: number;
  supported: boolean;
}

export type HouseholdMonthlyInsertRequest = {
  financialCategory: string; // 財務類別，不可為空

  money: number; // 金額，必須為非負數

  financialType: string; // 財務類型，不可為空

  year: number; // 年度，不可為空

  monthly: number; // 月份，範圍必須為 1-12
};

export type FileResponse={
  url:string,
  contentType:string
}

export type ErrorType={
  status:string,
  data:string,
  originalStatus:number
  error:string
}