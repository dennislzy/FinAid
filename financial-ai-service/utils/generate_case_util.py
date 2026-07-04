import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime
import math
import os
# from config import password

db_user = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")

def generate_case_summary(case_info_id)->str:
    """
    根據個案id 查詢個案相對應的資料
    """
    # 查詢資料
    case_info = pd.read_sql(f"SELECT * FROM case_info WHERE caseInfoId = '{case_info_id}'", engine)
    if case_info.empty:
        return "未找到相關個案資訊"
    
    # 獲取相關表資料
    funds = pd.read_sql(f"SELECT * FROM fund_invest WHERE caseInfoId = '{case_info_id}'", engine)
    stocks = pd.read_sql(f"SELECT * FROM stock_purchase_records WHERE caseInfoId = '{case_info_id}'", engine)
    subsidies = pd.read_sql(f"SELECT * FROM subsidy_list WHERE caseInfoId = '{case_info_id}'", engine)
    
    # 獲取標會記錄
    bidding_records = pd.read_sql(f"SELECT * FROM bidding_records WHERE caseInfoId = '{case_info_id}'", engine)
    
    # 獲取公債列表
    bond_list = pd.read_sql(f"SELECT * FROM bond_list WHERE caseInfoId = '{case_info_id}'", engine)
    
    # 獲取保險列表
    insurance_list = pd.read_sql(f"SELECT * FROM insurance_list WHERE caseInfoId = '{case_info_id}'", engine)
    
    # 獲取家庭成員資料
    family_members = pd.read_sql(f"SELECT * FROM household_family_members WHERE caseInfoId = '{case_info_id}'", engine)
    
    # 獲取2024年的家庭年度和月度財務記錄
    year_records = pd.read_sql(f"SELECT * FROM household_year_financial_records WHERE caseInfoId = '{case_info_id}' AND year = 2024", engine)
    monthly_records = pd.read_sql(f"SELECT * FROM household_monthly_financial_records WHERE caseInfoId = '{case_info_id}' AND year = 2024", engine)
    
    # 格式化日期的函數
    def format_date(date_str):
        if pd.isna(date_str):
            return "未提供"
        try:
            if isinstance(date_str, datetime):
                return date_str.strftime('%Y年%m月%d日')
            date_obj = datetime.strptime(str(date_str), '%Y-%m-%d')
            return date_obj.strftime('%Y年%m月%d日')
        except:
            return str(date_str)
    
    # 生成文本描述
    case = case_info.iloc[0]
    
    summary = f"""
基本資料:
- 中文姓名: {case['caseInfoName']}
- 英文姓名: {case['caseInfoEnglishName'] if pd.notna(case['caseInfoEnglishName']) else '未提供'}
- 性別: {case['caseInfoGender']}
- 出生日期: {format_date(case['caseInfoBirth'])}
- 地址: {case['caseInfoAddress'] if pd.notna(case['caseInfoAddress']) else '未提供地址'}
- 城市: {case['caseInfoCity'] if pd.notna(case['caseInfoCity']) else '未提供'}
- 郵遞區號: {case['caseInfoPostCode'] if pd.notna(case['caseInfoPostCode']) else '未提供'}
- 電子郵件: {case['caseInfoEmail'] if pd.notna(case['caseInfoEmail']) else '未提供電子郵件'}
- 聯絡電話: {case['caseInfoPhone'] if pd.notna(case['caseInfoPhone']) else '未提供電話'}
- 身分證號: {case['caseInfoIdentification'] if pd.notna(case['caseInfoIdentification']) else '未提供'}
- 居住狀況: {case['caseInfoLiveStatus'] if pd.notna(case['caseInfoLiveStatus']) else '未提供'}
- 緊急聯絡人: {case['caseInfoEmergencyContact'] if pd.notna(case['caseInfoEmergencyContact']) else '未提供'}
- 緊急聯絡人電話: {case['caseInfoEmergencyPhone'] if pd.notna(case['caseInfoEmergencyPhone']) else '未提供'}
- 緊急聯絡人關係: {case['caseInfoEmergencyRelate'] if pd.notna(case['caseInfoEmergencyRelate']) else '未提供'}
- 家庭電話: {case['caseInfoHomePhone'] if pd.notna(case['caseInfoHomePhone']) else '未提供'}
- 建檔時間: {case['caseInfoCreateTime'] if pd.notna(case['caseInfoCreateTime']) else '未提供'}
- 職業: {case['caseInfoCareer'] if pd.notna(case['caseInfoCareer']) else '未提供'}
- 戶籍登記時間: {format_date(case['caseInfoHouseholdRegisterTime']) if pd.notna(case['caseInfoHouseholdRegisterTime']) else '未提供'}
- 是否為原住民: {case['isIndigenousOrNewResident'] if pd.notna(case['isIndigenousOrNewResident']) else '未提供'}
- 是否為新住民: {case['isIndigenousOrNewResident'] if pd.notna(case['isIndigenousOrNewResident']) else '未提供'}
- 是否具有身心障礙: {case['isDisability'] if pd.notna(case['isDisability']) else '未提供'}
- 是否有福利身分證明: {case['isWelfareIdentityProof'] if pd.notna(case['isWelfareIdentityProof']) else '未提供'}
- 持續工作幾個月:{case['stableMonths'] if pd.notna(case['stableMonths']) else '未提供'}
- 就業狀態: {case['employmentType'] if pd.notna(case['employmentType']) else '未提供'}
"""
    
    # 家庭成員資料
    if not family_members.empty:
        summary += "\n家庭成員資料:\n"
        count =0
        for _, member in family_members.iterrows():
            summary += f"- 姓名: {member['name']}, 與個案關係: {member['relationshipToCase']}\n"
            summary += f"  是否有收入: {'是' if member['hasIncome'] else '否'}\n"
            if member['hasIncome']:
                summary += f"  年薪: {member['yearSalary']}元\n"
            summary += f"  是否由個案扶養: {'是' if member['isSupportedByCase'] else '否'}\n"
            count+=1
    
    # 標會記錄
    if not bidding_records.empty:
        summary += "\n標會記錄:\n"
        for _, record in bidding_records.iterrows():
            summary += f"- 標會類型: {record['isDead']}, 月金額: {record['monthlyAmount']}元\n"
            summary += f"  期數: {record['period']}, 開始日期: {format_date(record['startDate'])}, 結束日期: {format_date(record['endDate'])}\n"
            summary += f"  底標金額: {record['baseBidAmount']}元, 月外標: {record['monthlyExtraBid']}元, 其他: {record['other']}元\n"
    
    # 公債列表
    if not bond_list.empty:
        summary += "\n公債列表:\n"
        for _, bond in bond_list.iterrows():
            summary += f"- 公債名稱: {bond['bondName']}\n"
            summary += f"  公司名稱: {bond['companyName']}, 金額: {bond['money']}元, 申請時間: {format_date(bond['applyTime'])}\n"
    
    # 基金投資情況
    if not funds.empty:
        summary += "\n基金投資情況:\n"
        for _, fund in funds.iterrows():
            summary += f"- 基金名稱: {fund['fundName']}, 發行機構: {fund['issuer']}\n"
            summary += f"  投資金額: {fund['investmentAmount']}元, 購買日期: {format_date(fund['fundPurchaseDate'])}\n"
            summary += f"  投資方式: {fund['investmentMethod']}, 國內/國外: {fund['isForeign']}\n"
    
    # 股票投資情況
    if not stocks.empty:
        summary += "\n股票投資情況:\n"
        for _, stock in stocks.iterrows():
            summary += f"- 股票代碼: {stock['stockCode']}, 持有股數: {stock['shares']}股\n"
            summary += f"  平均買入價: {stock['averageBuyPrice']}元, 購買日期: {format_date(stock['stockPurchaseDate'])}\n"
    
    # 補助記錄
    if not subsidies.empty:
        summary += "\n補助記錄:\n"
        for _, subsidy in subsidies.iterrows():
            summary += f"- 補助名稱: {subsidy['subsidyName']}\n"
            summary += f"  金額: {subsidy['money']}元, 申請時間: {format_date(subsidy['applyTime'])}, 領取時間: {format_date(subsidy['receiveTime'])}\n"
    
    # 保險記錄
    if not insurance_list.empty:
        summary += "\n保險記錄:\n"
        for _, insurance in insurance_list.iterrows():
            summary += f"- 家庭成員: {insurance['familyMember']}\n"
            summary += f"  保險類型: {insurance['insuranceType']}, 保額: {insurance['amount']}元\n"
            if pd.notna(insurance['annualPremium']):
                summary += f"  年保費: {insurance['annualPremium']}元\n"
            if 'insuranceCompanyName' in insurance and pd.notna(insurance['insuranceCompanyName']):
                summary += f"  保險公司: {insurance['insuranceCompanyName']}\n"
    
    # 添加2024年家庭年度財務記錄
    total_year_income_records =0
    total_year_expense_records=0
    assets = 0
    debt =0
    total_month_records=0
    if not year_records.empty:
        summary += "\n2024年度財務記錄:\n"
        total_year_income_records =0
        total_year_expense_records=0
        
        # 分類顯示：收入、支出、資產、負債
        income_records = year_records[year_records['financialType'] == '收入']
        expense_records = year_records[year_records['financialType'] == '支出']
        asset_records = year_records[year_records['financialType'] == '資產']
        debt_records = year_records[year_records['financialType'] == '負債']
        
        if not income_records.empty:
            summary += "  收入項目:\n"
            for _, record in income_records.iterrows():
                summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                summary += f"    (建立時間: {record['yearCreate']}, 最後編輯: {record['yearEditLast'] if pd.notna(record['yearEditLast']) else '無'})\n"
                total_year_income_records+=record['money']
        
        if not expense_records.empty:
            summary += "  支出項目:\n"
            for _, record in expense_records.iterrows():
                summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                total_year_expense_records+=record['money']
        
        if not asset_records.empty:
            summary += "  資產項目:\n"
            for _, record in asset_records.iterrows():
                summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                assets+=record['money']

        if not debt_records.empty:
            summary += "  負債項目:\n"
            for _, record in debt_records.iterrows():
                summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                debt+=record['money']
    
    # 添加2024年家庭月度財務記錄
    if not monthly_records.empty:
        # 按月份分組並排序
        monthly_records_sorted = monthly_records.sort_values('monthly')
        months = monthly_records_sorted['monthly'].unique()

        
        summary += "\n2024年月度財務記錄:\n"
        for month in months:
            summary += f"\n2024年{month}月財務情況:\n"
            month_data = monthly_records_sorted[monthly_records_sorted['monthly'] == month]
            
            # 分類顯示：收入、支出、資產、負債
            income_records = month_data[month_data['financialType'] == '收入']
            expense_records = month_data[month_data['financialType'] == '支出']
            asset_records = month_data[month_data['financialType'] == '資產']
            debt_records = month_data[month_data['financialType'] == '負債']
            if not income_records.empty:
                summary += "  收入項目:\n"
                for _, record in income_records.iterrows():
                    summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                    total_year_income_records+=record['money']
                    total_month_records+=record['money']
            
            if not expense_records.empty:
                summary += "  支出項目:\n"
                for _, record in expense_records.iterrows():
                    summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                    total_year_expense_records+=record['money']
            
            if not asset_records.empty:
                summary += "  資產項目:\n"
                for _, record in asset_records.iterrows():
                    summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                    total_year_income_records+=0
            
            if not debt_records.empty:
                summary += "  負債項目:\n"
                for _, record in debt_records.iterrows():
                    summary += f"  - {record['financialCategory']}: {record['money']}元\n"
                    total_year_expense_records+=0
    summary+= f"2024年總負債為:{debt}元\n"
    summary+= f"2024年總資產為:{assets}元\n"
    summary+= f"2024年總收入為:{total_year_income_records}元\n"
    summary+= f"2024年總支出為:{total_year_expense_records}元\n"
    summary+= f"2024年資產净值為:{assets-debt}\n"
    summary+= f"2024年平均月收入為:{math.floor(total_month_records/12)/(count+1)}元\n"
    return summary


