import os

summary_prompt="""請從以下訪談逐字稿中截取關鍵資訊：
{text}

請整理以下面向的重要內容：
1. 案主基本狀況和需求
2. 財務問題和困境
3. 家庭經濟狀況
4. 工作和收入情況
5. 社會資源連結狀況

注意事項：
- 直接摘錄關鍵的數字資訊（如：收入、支出、債務金額等）
- 摘錄重要的時間點和事件
- 摘錄逐字稿中提及的主要擔憂和期待
- 不加入個人分析或評估

請提供純粹摘錄的資訊整理："""

combine_prompt="""
請將以下多個財務社工訪談摘要整合成一份完整的訪談紀錄：

{text}

請依照以下結構來組織資訊：

1. 案主基本資料和家庭狀況
2. 財務困境和問題
   - 財務狀況
   - 困難點
3. 家庭收支情況
   - 收入來源和金額
   - 主要支出項目
   - 收支情形

注意事項：
- 僅整合原始摘要中的資訊，不添加任何分析
- 保留所有重要的數據和時間點
- 使用中性、客觀的語言呈現

請提供純粹整合的資訊紀錄：
"""

test_text="""
   受訪者的姓名是張三，英文名字叫 John Zhang，性別是男性，出生於 1990 年 1 月 15 日。他說，平常主要用手機聯絡，號碼是 0912345678
談到家庭狀況時，他提到目前是自己住。他的緊急聯絡人是朋友王小明，平時家裡人也會幫忙接聽。他現在的工作是軟體工程師。
聊到投資，他說目前持有 100 股 2330.TW 的股票，平均購買價格是每股 150.5 元。他提到這筆投資主要是為了長期增值，暫時還沒有打算賣出。
在財務記錄方面，他分享了一些年度的家庭收支情況。他表示，2024 年的收入主要來自工資，共有 80 萬元，加上股票收益 20 萬元。至於支出，最大的部分是生活費 40 萬元，其次是租金 20 萬元。此外，他還提到，2024 年買了一台價值 120 萬元的汽車，這是家裡新增的一筆資產。
每月的收支中，他提到 2024 年 10 月的收入主要來自工資，金額是 6 萬元。當月的支出包括 2 萬元的租金、3 萬元的生活費，還有一些零星花費，大約 5000 元。
說到保險，他表示為了家庭安全，他給自己買了一份壽險，保額是 500 萬元，年繳保費為 5 萬元。
最後，談到標會的情況，他說他目前參加了一個標會，是屬於「活會」。每月繳的金額是 1 萬元，補助期限是 12 個月，從 2024 年 1 月 1 日開始，到 2024 年 12 月 31 日結束。他還提到，基本標金的金額是 10 萬元，每月額外的標金是 2 萬元，另外還有一些其他的標金，金額大約是 1 萬元。
"""

database_prompt="""
你是一個專業的信息提取專家。請從以下文本中提取關鍵信息，並按以下格式輸出JSON：
{{
   "case_info": {{
         "caseInfoName": "姓名",
         "caseInfoEnglishName": "英文名",
         "caseInfoGender": "性別",
         "caseInfoBirth": "",
         "caseInfoAddress": "地址",
         "caseInfoCity": "城市",
         "caseInfoPostCode": "郵編",
         "caseInfoEmail": "郵箱",
         "caseInfoPhone": "電話",
         "caseInfoIdentification": "身份證號",
         "caseInfoLiveStatus": "自住/租屋/其他",
         "caseInfoEmergencyContact": "緊急聯繫人",
         "caseInfoEmergencyPhone": "緊急聯繫電話",
         "caseInfoEmergencyRelate": "與緊急聯繫人關係",
         "caseInfoHomePhone": "家庭電話",
         "caseInfoCareer": "職業"
   }},
   "stock_purchase_records":[
   {{
       "shares": 0,  # 必須是整數
       "averageBuyPrice": 0.0,  # 必須是數字，可以有小數點
       "stockCode":"股票代碼",
       "stockPurchaseDate":"股票購買時間" - 日期格式：YYYY-MM-DD（例如：2024-10-23）
   }}
   ],
   "household_year_financial_records": [ // 每年財務記錄列表
    {{
      "financialCategory": "string", // 財務細項類型
      "financialType": "string", // 類別需為 收入，支出，資產，負債
      "money": "int", // 金額（整數格式）
      "year": "int" // 年份（整數格式）
    }}
  ],
  "household_monthly_financial_records": [ // 每月財務記錄列表
    {{
      "financialCategory": "string", // 財務類別（如薪水、租金等）
      "financialType": "string", // 類型需為收入，支出，資產，負債
      "money": "int", // 金額（整數格式）
      "monthly": "int", // 月份（整數格式）
      "year": "int" // 年份（整數格式）
    }}
  ],
  "insurance_list":[
   {{
      "insuranceType":string", // 保險類型
      "familyMember":"string", //家庭成員
      "amount":"int",//保險金額
      "annualPremium":"int",//年繳保費
   }}
   ],
   "fund_invest": [
   {{
      "fundName": "string",// 基金名稱
      "fundPurchaseDate": "date", //基金購買時間
      "issuer": "Example Issuer", //發行名稱
      "investmentAmount": 1000000, //投資金額
      "investmentMethod": "Lump Sum",//投資方法
      "isForeign": "boolen"//是否在國外購買
    }}
   ],
   "aid_association":[
       {{
          "isDead": "string", // 活會或死會
          "monthlyAmount": "decimal", // 每月金額
          "period": "integer", // 補助的總期數
          "startDate": "date", // 補助開始日期
          "endDate": "date", // 補助結束日期
          "baseBidAmount": "int", // 基本標金金額
          "monthlyExtraBid": "int", // 每月額外標金
          "other": "int" // 其他標金
        }}
   ] 
   ""
   ""
}}
請確保輸出為有效的JSON格式。
"""
template = """
你是一位專業的財務社工師，具備以下特質和專業知識:

專業背景：
- 具有社會工作師及財務諮詢輔導員雙重資格
- 專精於整合性評估與處遇規劃
- 擅長連結多面向資訊進行分析
- 熟悉財務困境家庭的介入策略
- 具備跨專業合作評估經驗

分析特色：
- 善於整合多元資訊
- 能提供具體可行的建議
- 重視案家的執行能力
- 專注於優先順序的安排
- 注重實務面的介入策略

當進行會談後評估時，請依照以下架構分析：

一、評估與分析
1. 個人層面：
  - 教育與工作背景
  - 財務知能狀況
  - 債務因應態度
  - 改變動機評估
  
2. 家庭層面：
  - 家庭結構特徵
  - 經濟支持系統
  - 家庭互動模式
  - 財務決策模式

3. 社會資源層面：
  - 已連結資源
  - 潛在資源
  - 支持網絡功能

4. 風險評估：
  - 高風險因素
  - 保護因子
  - 危機程度

二、處遇建議
1. 短期目標（3個月內）：
  - 立即性任務
  - 危機處理重點
  - 初步改善方向

2. 中期目標（3-6個月）：
  - 債務處理規劃
  - 收支改善計畫
  - 資源連結安排

3. 長期目標（6個月以上）：
  - 財務管理能力提升
  - 家庭支持系統強化
  - 永續發展規劃

4. 具體執行建議：
  - 優先處理事項
  - 分階段任務
  - 配套措施

分析注意事項：
* 需整合所有前期資訊
* 評估建議的可行性
* 考量案家的執行力
* 注意資源的可及性


基於以下資訊回答問題:
{context}
案主問題: {question}
"""

