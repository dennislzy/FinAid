import { Control } from "react-hook-form";

export interface InputColumnProps {
    label?: string;
    id: string;
    isSelectItem?: boolean;
    selectItem?: {
      inputLabel: string;
      menuItem: string[];
    };
    type?: string;
    value?: any
    setValue?:(name: string, value: any) => void;
    control?: Control; // 添加這行
    required?: boolean;
  }

export type SelectItemProps={
    inputLabel:string,
    menuItem:string[]
}
 // 取得當天日期並格式化
const today = new Date().toISOString().split("T")[0]; 

//存放欄位訊息
// 從這裡開始的大段是第一張表的欄位
export const columnList:InputColumnProps[]=[
    {
        label:'個案中文姓名',
        id:'caseInfoName',
        isSelectItem:false,
        required:true
    },
    {
        label:'個案英文姓名',
        id:'caseInfoEnglishName',
        isSelectItem:false
    },
    {
        isSelectItem:true,
        id:'caseInfoGender',
        value:'男',
        selectItem:{
            menuItem:['男','女','其他'],
            inputLabel:'性別'
        }
    },
    {
        label:'聯絡電話',
        id:'caseInfoPhone',
        isSelectItem:false,
        // value:"09"
    },
    {
        label:'家中電話',
        id:'caseInfoHomePhone',
        isSelectItem:false,
        // value:"02"
    },
    {
        label:'電子郵件',
        id:'caseInfoEmail',
        isSelectItem:false
    },
    {
        label:'身分證字號',
        id:'caseInfoIdentification',
        isSelectItem:false,
    },
    {
        label:'出生年月日',
        id:'caseInfoBirth',
        type:'date',
        isSelectItem:false,
        value:today
    },
    {
        label:'郵遞區號',
        id:'caseInfoPostCode',
        isSelectItem:false
    },
    {
        label:'地址',
        id:'caseInfoAddress',
        isSelectItem:false
    },
    {
        label:'所在縣市',
        id:'caseInfoCity',
        isSelectItem:false
    },
    
    {
        label:'緊急聯絡人',
        id:'caseInfoEmergencyContact',
        isSelectItem:false
    },
    {
        label:'緊急連絡人電話',
        id:'caseInfoEmergencyPhone',
        isSelectItem:false
    },
    {
        isSelectItem:true,
        id:'caseInfoEmergencyRelate',
        value:'父親',
        selectItem:{
            menuItem:['父親','母親','配偶','祖父母','小孩','親戚','朋友','其他'],
            inputLabel:'緊急聯絡人與個案關係'
        }
    },
    {
        label:'個案職業',
        id:'caseInfoCareer',
        isSelectItem:false
    },
    {
        isSelectItem:true,
        id:'employmentType',
        value:'全職',
        selectItem:{
            menuItem:['全職','兼職','打工','自營','無業'],
            inputLabel:'職業穩定度'
        }
    },
    {
        label:'收入持續月份',
        id:'stableMonths',
        isSelectItem:false
    },
    {
        label: '設籍時間',
        id: 'caseInfoHouseholdRegisterTime',
        type: 'date',
        isSelectItem: false,
        value: today
    },
    {
        isSelectItem:true,
        id:'isWelfareIdentityProof',
        value:'否',
        selectItem:{
            menuItem:['是','否'],
            inputLabel:'是否有中低收入戶證明'
        }
    },
    {
        isSelectItem:true,
        id:'isIndigenousOrNewResident',
        value:'否',
        selectItem:{
            menuItem:['是','否'],
            inputLabel:'是否為原住民或新住民'
        }
    },
    {
        isSelectItem:true,
        id:'isDisability',
        value:'否',
        selectItem:{
            menuItem:['是','否'],
            inputLabel:'是否有身心障礙證明'
        }
    },
    {
        isSelectItem:true,
        id:'caseInfoLiveStatus',
        value:'自住',
        selectItem:{
            menuItem:['自住','租屋','居無定所','其他'],
            inputLabel:'居住狀況'
        }
    },
    
]

export const columnList2:InputColumnProps[]=[
    {
        label:'家庭成員(包含關係、姓名、年齡)',
        id:'family_member',
        isSelectItem:false
    },
]


// 從第二頁開始
// 年收入支出表
// 收入
export const annualIncomeList:InputColumnProps[]=[
    {
        label:'年終獎金',
        id:'year_end_bonus',
        isSelectItem:false
    },
    {
        label:'股利股息',
        id:'dividends',
        isSelectItem:false
    },
    {
        label:'存款利息',
        id:'deposit_interest',
        isSelectItem:false
    },
    {
        label:'公司債利息',
        id:'bond_interest',
        isSelectItem:false
    },
    {
        label:'其他',
        id:'other_annual_income',
        isSelectItem:false
    },
]

export const sumAnnualIncomeList:InputColumnProps[]=[
    {
        label:'家庭年度總收入',
        id:'total_annual_income',
        isSelectItem:false
    },
]
// 年支出
export const annualExpendList:InputColumnProps[]=[
    {
        label:'所得稅',
        id:'income_tax ',
        isSelectItem:false
    },
    {
        label:'房屋稅',
        id:'house_tax ',
        isSelectItem:false
    },
    {
        label:'地價稅',
        id:'land_tax ',
        isSelectItem:false
    },
    {
        label:'汽機車稅',
        id:'vehicle_tax ',
        isSelectItem:false
    },
    {
        label:'產險',
        id:'insurance',
        isSelectItem:false
    },
    {
        label:'其他',
        id:'other_annual_expend',
        isSelectItem:false
    },
]

export const sumannualExpendList:InputColumnProps[]=[
    {
        label:'家庭年度總支出',
        id:'total_annual_expend',
        isSelectItem:false
    },
]
// 總共
export const balancePerYearList:InputColumnProps[]=[
    {
        label:'每年餘額(收入-支出)',
        id:'balance_per_year',
        isSelectItem:false
    },
]


// 家庭資產負債狀況表
// 流動資產
export const currentAssetsList:InputColumnProps[]=[
    {
        label:'現金',
        id:'cash',
        isSelectItem:false
    },
    {
        label:'活期存款',
        id:'demand_deposit',
        isSelectItem:false
    },
    {
        label:'定期存款',
        id:'fixed_deposit',
        isSelectItem:false
    },
    {
        label:'支票存款',
        id:'check_deposit',
        isSelectItem:false
    },
    {
        label:'短期票券',
        id:'short_term_bill',
        isSelectItem:false
    },
    {
        label:'保單現值',
        id:'insurance_cash_value',
        isSelectItem:false
    },
    {
        label:'個人資產',
        id:'personal_asset',
        isSelectItem:false
    },
    {
        label:'自用住宅(價值)',
        id:'housing_value',
        isSelectItem:false
    },
    {
        label:'汽車(價值)',
        id:'vehicle_value',
        isSelectItem:false
    },
    {
        label:'珠寶及收藏品',
        id:'collectibles',
        isSelectItem:false
    },
    {
        label:'其他',
        id:'other_current_asset',
        isSelectItem:false
    },
    // {
    //     label:'全部流動資產',
    //     id:'all_flow_asset',
    //     isSelectItem:false
    // },
]
// 投資資產
export const investmentAssetsList:InputColumnProps[]=[
    {
        label:'股票',
        id:'stocks',
        isSelectItem:false
    },
    {
        label:'公司債券',
        id:'corporate_bond',
        isSelectItem:false
    },
    {
        label:'國內基金',
        id:'domestic_fund',
        isSelectItem:false
    },
    {
        label:'國外基金',
        id:'fund',
        isSelectItem:false
    },
    {
        label:'標會(己繳活會)',
        id:'active_association ',
        isSelectItem:false
    },
    {
        label:'借貸他人款項(長期)',
        id:'loan_individual',
        isSelectItem:false
    },
    {
        label:'貴重金屬',
        id:'precious_metal',
        isSelectItem:false
    },
    {
        label:'不動產',
        id:'real_estate',
        isSelectItem:false
    },
    {
        label:'其他',
        id:'other_invest_asset',
        isSelectItem:false
    },
]
export const sumAssetsList:InputColumnProps[]=[
    {
        label:'資產合計',
        id:'totalAssets',
        isSelectItem:false
    },
]
// 短期負債
export const shortTermList:InputColumnProps[]=[
    {
        label:'信用卡',
        id:'credit_card',
        isSelectItem:false
    },
    {
        label:'分期付款',
        id:'installment_loan',
        isSelectItem:false
    },
    {
        label:'壽險借款',
        id:'life_insurance_loan',
        isSelectItem:false
    },
    {
        label:'消費性貸款',
        id:'consumer_loan',
        isSelectItem:false
    },
    {
        label:'標會(己標死會)',
        id:'dead_assoc',
        isSelectItem:false
    },
]
// 長期負債
export const longTermList:InputColumnProps[]=[
    {
        label:'房屋貸款',
        id:'house_loan',
        isSelectItem:false
    },
    {
        label:'汽車貸款',
        id:'car_loan',
        isSelectItem:false
    },
    {
        label:'其他',
        id:'other_loan',
        isSelectItem:false
    },
]
export const sumLiabilitiesList:InputColumnProps[]=[
    {
        label:'負債合計',
        id:'all_liability',
        isSelectItem:false
    },
]
// 總共
export const netAssetList:InputColumnProps[]=[
    {
        label:'家庭資產淨值(資產-負債)',
        id:'equity',
        isSelectItem:false
    },
]
// 年收入支出表填表日期
export const fillingDateList:InputColumnProps[]=[
    {
        label:'填表日期',
        id:'fillingDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
]


// 第三頁開始
// 股票投資明細
// 1
export const stockInvestmentList1:InputColumnProps[]=[
    {
        label:'股票代碼',
        id:'stockCode',
        isSelectItem:false
    },
    {
        label:'股數',
        id:'shares',
        isSelectItem:false
    },
    {
        label:'平均每股買進金額',
        id:'averageBuyPrice',
        isSelectItem:false
    },
    {
        label:'最新購買日期',
        id:'stockPurchaseDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
]

// 津貼/補助
export const allowanceInvestmentList:InputColumnProps[]=[
    {
        label:'補助/津貼名稱',
        id:'subsidyName',
        isSelectItem:false
    },
    {
        label:'金額',
        id:'money',
        isSelectItem:false
    },
    {
        label:'申請時間',
        id:'applyTime',
        type:'date',
        isSelectItem:false,
        value:today
    },
    {
        label:'領取日期',
        id:'receiveTime',
        type:'date',
        isSelectItem:false,
        value:today
    },
]

// 債券
export const bondList:InputColumnProps[]=[
    {
        label:'債券名稱',
        id:'bondName',
        isSelectItem:false
    },
    {
        label:'公司名稱',
        id:'companyName',
        isSelectItem:false
    },
    {
        label:'金額',
        id:'money',
        isSelectItem:false
    },
    {
        label:'購買日期',
        id:'applyTime',
        type:'date',
        isSelectItem:false,
        value:today
    },
]

// 2
export const stockInvestmentList2:InputColumnProps[]=[
    {
        label:'股票代碼',
        id:'stockCode',
        isSelectItem:false
    },
    {
        label:'買進時間',
        id:'stockPurchaseDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
]
// 3
export const stockInvestmentList3:InputColumnProps[]=[
    
    {
        label:'股數',
        id:'shares',
        isSelectItem:false
    },
    {
        label:'平均每股買進金額',
        id:'averageBuyPrice',
        isSelectItem:false
    },
]

// 基金投資(國內)
// 1
export const fundInvestmentList1:InputColumnProps[]=[
    {
        label:'基金名稱',
        id:'fundName',
        isSelectItem:false
    },
    {
        label:'最新購買日期',
        id:'fundPurchaseDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
    {
        label:'發行單位',
        id:'issuer',
        isSelectItem:false,
    },
    {
        label:'投資金額',
        id:'investmentAmount',
        isSelectItem:false
    }, 
    {
        id:'investmentMethod',
        isSelectItem:true,
        value:'定',
        selectItem:{
            menuItem:['定','單'],
            inputLabel:'投入方式'
        }
    },
    {
        id:'isForeign',
        isSelectItem:true,
        value:'國內',
        selectItem:{
            menuItem:['國內','國外'],
            inputLabel:'國內/國外'
        }
    },
]
// 基金編輯用的
// 唯讀部分
export const fundInvestmentList2:InputColumnProps[]=[
    {
        label:'基金名稱',
        id:'fundName',
        isSelectItem:false
    },
    {
        label:'最新購買日期',
        id:'fundPurchaseDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
    
]
// 可修改部分
export const fundInvestmentList3:InputColumnProps[]=[
    {
        label:'發行單位',
        id:'issuer',
        isSelectItem:false,
    },
    {
        label:'投資金額',
        id:'investmentAmount',
        isSelectItem:false
    }, 
    {
        id:'investmentMethod',
        isSelectItem:true,
        selectItem:{
            menuItem:['定','單'],
            inputLabel:'投入方式'
        }
    },
    {
        id:'isForeign',
        isSelectItem:true,
        selectItem:{
            menuItem:['國內','國外'],
            inputLabel:'國內/國外'
        }
    },
]

// 標會投資明細
// 1
export const biddingInvestmentList1:InputColumnProps[]=[
    {
        id:'isDead',
        isSelectItem:true,
        value:'活會',
        selectItem:{
            menuItem:['活會','死會'],
            inputLabel:'活會/死會'
        }
    },
    {
        label:'每會金額',
        id:'monthlyAmount',
        isSelectItem:false
    },
    {
        label:'標會期間',
        id:'period',
        isSelectItem:false
    },
    {
        label:'標會開始時間',
        id:'startDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
    {
        label:'標會結束時間',
        id:'endDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
    {
        label:'底標標金',
        id:'baseBidAmount',
        isSelectItem:false
    },     
    {
        label:'月外標',
        id:'monthlyExtraBid',
        isSelectItem:false
    },
    {
        label:'月標或其他金額',
        id:'other',
        isSelectItem:false
    },
]


// 第四頁
// 保險
// 先生
export const InsuranceList1:InputColumnProps[]=[
    {
        label:'壽險',
        id:'insurance_life1',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident1',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med1',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance1',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium1',
        isSelectItem:false,
    },
]
// 太太
export const InsuranceList2:InputColumnProps[]=[
    {
        label:'壽險',
        id:'insurance_life2',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident2',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med2',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance2',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium2',
        isSelectItem:false,
    },
]
// 孩子1
export const InsuranceList3:InputColumnProps[]=[
    {
        label:'壽險',
        id:'insurance_life3',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident3',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med3',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance3',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium3',
        isSelectItem:false,
    },
]
// 孩子2
export const InsuranceList4:InputColumnProps[]=[
    {
        label:'壽險',
        id:'insurance_life4',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident4',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med4',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance4',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium4',
        isSelectItem:false,
    },
]
// 父母
export const InsuranceList5:InputColumnProps[]=[
    {
        label:'壽險',
        id:'insurance_life5',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident5',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med5',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance5',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium5',
        isSelectItem:false,
    },
]
// 空欄1
export const InsuranceList6:InputColumnProps[]=[
    {
        label:'名字',
        id:'otherName6',
        isSelectItem:false
    },
    {
        label:'壽險',
        id:'insurance_life6',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident6',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med6',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance6',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium6',
        isSelectItem:false,
    },
]
// 空欄2
export const InsuranceList7:InputColumnProps[]=[
    {
        label:'名字',
        id:'otherName7',
        isSelectItem:false
    },
    {
        label:'壽險',
        id:'insurance_life7',
        isSelectItem:false
    },
    {
        label:'意外險',
        id:'insurance_accident7',
        isSelectItem:false
    },
    {
        label:'醫療癌症',
        id:'insurance_med7',
        isSelectItem:false
    },
    // {
    //     label:'其他',
    //     id:'otherInsurance7',
    //     isSelectItem:false,
    // },
    {
        label:'年保費',
        id:'annual_premium7',
        isSelectItem:false,
    },
]


// 第五頁
// 每月收支
// 月收入
export const monthlyIncomeList:InputColumnProps[]=[
    {
        label:'薪資',
        id:'salary',
        isSelectItem:false
    },
    {
        label:'津貼',
        id:'allowance',
        isSelectItem:false
    },
    {
        label:'補助',
        id:'subsidy',
        isSelectItem:false
    },
    {
        label:'投資',
        id:'investment',
        isSelectItem:false
    },
    {
        label:'其他',
        id:'other_month_income',
        isSelectItem:false,
    },
]
export const sumMonthlyIncomeList:InputColumnProps[]=[
    {
        label:'總收入',
        id:'monthly_income',
        isSelectItem:false
    },
]

// 月支出
export const monthlyExpensesList:InputColumnProps[]=[
    {
        label:'食',
        id:'caseEat',
        isSelectItem:false
    },
    {
        label:'衣',
        id:'caseClothes',
        isSelectItem:false
    },
    {
        label:'住',
        id:'caseLive',
        isSelectItem:false
    },
    {
        label:'行',
        id:'caseAction',
        isSelectItem:false
    },
    {
        label:'育',
        id:'caseEducate',
        isSelectItem:false,
    },
    {
        label:'樂',
        id:'casePlay',
        isSelectItem:false,
    },
    {
        label:'醫療',
        id:'caseMedical',
        isSelectItem:false,
    },
    {
        label:'電信',
        id:'caseTelecommunications',
        isSelectItem:false,
    },
    {
        label:'小孩',
        id:'caseKid',
        isSelectItem:false,
    },
    {
        label:'孝養',
        id:'caseFilialPiety',
        isSelectItem:false,
    },
    {
        label:'社會保險',
        id:'caseSocialInsurance',
        isSelectItem:false,
    },
    {
        label:'商業保險',
        id:'caseCommercialInsurance',
        isSelectItem:false,
    },
    {
        label:'自提勞退',
        id:'caseResignFromWork',
        isSelectItem:false,
    },
    {
        label:'儲蓄',
        id:'otherSave',
        isSelectItem:false,
    },
    {
        label:'投資',
        id:'caseInvestment',
        isSelectItem:false,
    },
]
export const monthlyExpensesList2:InputColumnProps[]=[
    {
        label:'信用卡還款',
        id:'caseCreditCardRepayment',
        isSelectItem:false,
    },
    {
        label:'信貸還款',
        id:'caseCreditRepayment',
        isSelectItem:false,
    },
    {
        label:'車貸還款',
        id:'caseCarLoanRepayment',
        isSelectItem:false,
    },
    {
        label:'朋友還款',
        id:'caseFriendDebtRepayment',
        isSelectItem:false,
    },
    {
        label:'其他還款',
        id:'caseOtherDebtRepayment',
        isSelectItem:false,
    },
]
export const sumMonthlyExpensesList:InputColumnProps[]=[
    {
        label:'總支出',
        id:'totalMonthlyExpenses',
        isSelectItem:false
    },
]

// 全部
export const sumMonthlyCashFlowList:InputColumnProps[]=[
    {
        label:'月現金流(總收入-總支出)',
        id:'totalMonthlyCashFlow',
        isSelectItem:false
    },
]

// 每月資產負債
// 資產
export const monthlyAssetList:InputColumnProps[]=[
    {
        label:'現金',
        id:'caseMonthlyCash',
        isSelectItem:false,
    },
    {
        label:'活存',
        id:'caseDemandDeposits',
        isSelectItem:false,
    },
    {
        label:'定存',
        id:'caseFixedDeposit',
        isSelectItem:false,
    },
    {
        label:'壽險',
        id:'caseMonthlyinsurance_life',
        isSelectItem:false,
    },
    {
        label:'投資現額',
        id:'caseMonthlyInvestmentCash',
        isSelectItem:false,
    },
    {
        label:'汽機車（新車總價ｘ５０％；二手車０元）',
        id:'caseMonthlyCar',
        isSelectItem:false,
    },
    {
        label:'其他',
        id:'caseOtherMonthlyAsset',
        isSelectItem:false,
    },
]
export const sumMonthlyAssetList:InputColumnProps[]=[
    {
        label:'總資產',
        id:'totalMonthlyAsset',
        isSelectItem:false
    },
]

// 負債
export const monthlyDebtList:InputColumnProps[]=[
    {
        label:'信用卡未繳餘額',
        id:'caseCreditCardUnpaidBalance',
        isSelectItem:false,
    },
    {
        label:'信貸未還餘額',
        id:'caseOutstandingCreditBalance',
        isSelectItem:false,
    },
    {
        label:'車貸未還餘額',
        id:'caseCarLoanOutstandingBalance',
        isSelectItem:false,
    },
    {
        label:'朋友借款',
        id:'caseFriendDebt',
        isSelectItem:false,
    },
    {
        label:'其他',
        id:'caseOtherMonthlyDebt',
        isSelectItem:false,
    },
]
export const sumMonthlyDebtList:InputColumnProps[]=[
    {
        label:'總負債',
        id:'totalMonthlyDebt',
        isSelectItem:false
    },
]

// 全部
export const sumMonthlyNetAssetList:InputColumnProps[]=[
    {
        label:'月資產淨值(資產-負債)',
        id:'totalMonthlyNetAsset',
        isSelectItem:false
    },
]

// 月收入支出表填表日期
export const monthlyFillingDateList:InputColumnProps[]=[
    {
        label:'填表日期',
        id:'monthlyFillingDate',
        type:'date',
        isSelectItem:false,
        value:today
    },
]












