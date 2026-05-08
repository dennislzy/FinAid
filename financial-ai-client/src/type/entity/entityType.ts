export type SocialWorker = {
    socialWorkerId: string;
    socialWorkerEmail: string; // 對應 @Email
    socialWorkerPassword?: string; // 對應 @JsonIgnore
    socialWorkerName: string;
    socialWorkerPermission:string; // 對應 @Enumerated(EnumType.STRING)
    loginToken?: string; // 對應 @Transient
};

// 客戶資訊
export type CaseInfo = {
    caseInfoId: string; // 案例 ID
    socialWorker?: SocialWorker; // 社工 Email 對應的物件，LAZY 加載
    caseInfoName: string; // 案例名稱
    caseInfoEnglishName: string; // 案例英文名稱
    caseInfoGender: string; // 案例性別 (Enum: MALE, FEMALE, OTHER)
    caseInfoBirth: Date; // 案例生日 (Date 格式)
    caseInfoAddress: string; // 案例地址
    caseInfoCity: string; // 案例所在城市
    caseInfoPostCode: string; // 案例郵遞區號
    caseInfoEmail: string; // 案例電子郵件
    caseInfoPhone: string; // 案例電話
    caseInfoIdentification: string; // 案例身份證編號
    caseInfoLiveStatus: string; // 案例居住狀態 (Enum: OWN, RENT, OTHER)
    caseInfoEmergencyContact: string; // 緊急聯絡人
    caseInfoEmergencyPhone: string; // 緊急聯絡人電話
    caseInfoEmergencyRelate: string; // 與緊急聯絡人的關係
    caseInfoHomePhone: string; // 案例家中電話
    caseInfoCreateTime?: string; // 案例建立時間 (ISO 格式字串)
    caseInfoImage?:string;
    caseInfoCareer:string;
    caseInfoHouseholdRegisterTime:Date; // 設籍時間
    isWelfareIdentityProof:string; // 是否有福利身分證明
    isIndigenousOrNewResident:string; // 是否為原住民或新住民
    isDisability:string; // 是否有身障
    employmentType:string; // 收入穩定度
    stableMonths:number; // 收入持續月份
};

export type StockPurchaseResponse={
    shares:number,
    averageBuyPrice: number 
    stockCode: string 
    caseInfo: CaseInfo 
    stockPurchaseDate: string
}

export type AllowancePurchaseResponse={
  subsidyId:number,
  money: number 
  subsidyName: string 
  caseInfo:CaseInfo 
  applyTime: Date
  receiveTime: Date
}

export type BondResponse={
  bondId:number,
  money: number 
  bondName: string 
  companyName: string 
  caseInfo:CaseInfo 
  applyTime: Date
}

export type FundInvestResponse = {
    fundName: string; // 基金名稱
    issuer: string; // 發行者
    investmentMethod: string; // 投資方式
    investmentAmount: number; // 投資金額
    isForeign: string; // 是否為外幣投資
    fundPurchaseDate: string; // 購買日期
    caseInfo: CaseInfo; // 案例資訊
  };

  export type HouseholdYearFinancialRecords = {
    financialYearRecordsId: string;
    year: number;
    caseInfo: CaseInfo; // 對應 `CaseInfo` 實體
    yearCreate: string; // ISO 格式的日期時間字串
    yearEditLast: string; // ISO 格式的日期時間字串
    financialCategory: string;
    financialType: string;
    money: number;
  };

  export type HouseholdYearSummaryResponse = {
    year: number;
    income: number;
    assets: number;
    liabilities: number;
    expenses: number;
    balance: number;
  };

  export type HouseholdMonthSummaryResponse = {
    month: number;
    income: number;
    expense: number;
  };

  export type FundUpdateRequest = {
    issuer: string;
    investmentMethod: string;
    investmentAmount: number;
    isForeign: string;
  };



export type AidAssociationResponse = {
  aidAssociationId: string; // 主鍵
  isDead?: string; // 活會或死會狀態
  monthlyAmount?: number; // 每會金額
  period?: number; // 當前期數
  startDate?: Date; // 開始日期
  endDate?: Date; // 結束日期
  baseBidAmount?: number; // 底標金額
  monthlyExtraBid?: number; // 月外標
  other?: number; // 其他
  caseInfo?: CaseInfo; // 外鍵對應的 CaseInfo
};

export type InsuranceListResponse = {
  insuranceType: string;
  familyMember: string;
  amount: number;
  annualPremium: number;
  caseInfo: CaseInfo;
  insuranceId: number;
  insuranceCompanyName: string
  
};

export type FamilyMemberResponse = {
  memberId: number;
  name: string;
  relationshipToCase: string;
  income: boolean;
  yearSalary?: number;
  supported: boolean;
}

export type HouseholdMonthlyFinancialRecords = {
  financialMonthlyRecordsId: string; // 財務月度記錄的唯一識別碼

  caseInfo?: CaseInfo; // 關聯的案件資訊，對應多對一關係，可能為 undefined

  financialCategory: string; // 財務類別

  financialType: string; // 財務類型

  monthly: number; // 月份，表示為數字 (1-12)

  money: number; // 金額

  year: number; // 年度，例如：2024
};

export type dashAssetResponse = {
  "非流動資產": number; 
  "流動資產": number; 
  
}
export type dashAllAssetResponse = {
  "不動產": number; 
  "個人貸款": number; 
  "其他資產": number; 
  "定期存款": number; 
  "收藏品": number; 
  "活期存款": number; 
  "貴重金屬": number; 
  "車輛價值": number; 
  "total": number; 
}
export type dashAllLiabilityResponse = {
  "信用卡債": number; 
  "其他貸款": number; 
  "房屋貸款": number; 
  "朋友借款": number; 
  "汽車貸款": number; 
  "消費型貸款": number; 
  "total": number; 
}
export type dashMonthlyBalanceResponse = {
  "income": number; 
  "month": string; 
  "balance": number; 
  "expense": number; 
}
export type dashOtherDetailResponse = {
  "biddingTotal": number; // 總標金額
  "year": number; 
  "subsidyApply": number; // 補助申請金額
  "bondInvestment": number; // 債券投資金額
  "stockInvestment": number; // 股票投資金額
  "fundInvestment": number; // 基金投資金額
}
export type dashInsuranceResponse = {
  "familyMember": string; // 家庭成員
  "amount": number; // 保險金額
  "insuranceType": string; // 保險類型
}

export interface Channel {
  channelId: string;
  socialWorker: SocialWorker;
  caseInfo: CaseInfo;
  channelTitle: string;
  channelMessages?: ChannelMessage[];
}

// ChannelMessage 實體類型
export interface ChannelMessage {
  channelMessageId: number;
  channel: Channel;
  channelRole: ChannelRole;
  channelMessage: string;
  channelMessageResponseTime: number;
  channelMessageToken: number;
}

type ChannelRole = 'AI'|'USER';