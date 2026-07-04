examples = [
    {
        "input": "查找所有居住在台北市的個案",
        "query": "SELECT * FROM case_info WHERE caseInfoCity = '台北市';"
    },
    {
        "input": "查找某個案的所有基金投資記錄",
        "query": "SELECT * FROM fund_invest WHERE caseInfoId = 'CASE001';"
    },
    {
        "input": "列出所有外幣基金投資",
        "query": "SELECT * FROM fund_invest WHERE isForeign = '是';"
    },
    {
        "input": "查找某個案2024年的所有月收支記錄",
        "query": "SELECT * FROM household_monthly_financial_records WHERE caseInfoId = 'CASE001' AND year = 2024;"
    },
    {
        "input": "計算某個案2024年的總收入",
        "query": "SELECT SUM(money) FROM household_year_financial_records WHERE caseInfoId = 'CASE001' AND year = 2024 AND financialCategory = '收入';"
    },
    {
        "input": "查找所有投標金額超過10000的記錄",
        "query": "SELECT * FROM bidding_records WHERE baseBidAmount > 10000;"
    },
    {
        "input": "列出某個案的所有保險記錄及年度保費總和",
        "query": "SELECT caseInfoId, SUM(annualPremium) as total_premium FROM insurance_list WHERE caseInfoId = 'CASE001' GROUP BY caseInfoId;"
    },
    {
        "input": "查找某個案的所有股票交易記錄並按購買日期排序",
        "query": "SELECT * FROM stock_purchase_records WHERE caseInfoId = 'CASE001' ORDER BY stockPurchaseDate DESC;"
    },
    {
        "input": "查詢個案的月收入來源",
        'query':"""
        SELECT financialType, SUM(money) as total_income 
        FROM household_monthly_financial_records 
        WHERE caseInfoId = 'b814d00fa0374be6a2e2bfe0248a585d' 
        AND financialType = '收入' 
        GROUP BY financialType;
        """
    },
    {
        "input":"查詢個案年收入來源",
        "query":"""
        SELECT financialType, SUM(money) as total_income 
        FROM household_year_financial_records 
        WHERE caseInfoId = 'b814d00fa0374be6a2e2bfe0248a585d' 
        AND financialType = '收入' 
        GROUP BY financialType;
        """
    },
    {
        "input": "列出所有個案的基本資料和他們的主要社工",
        "query": """
        SELECT c.caseInfoId, c.caseInfoName, c.caseInfoPhone, 
               s.socialWorkerName, s.socialWorkerEmail
        FROM case_info c
        JOIN social_worker s ON c.socialWorkerId = s.socialWorkerId;
        """
    },
    {
        "input": "查找某個社工負責的所有活躍個案數量",
        "query": """
        SELECT s.socialWorkerName, COUNT(c.caseInfoId) as case_count
        FROM social_worker s
        LEFT JOIN case_info c ON s.socialWorkerId = c.socialWorkerId
        WHERE c.caseInfoLiveStatus = '活躍'
        GROUP BY s.socialWorkerId;
        """
    },
    {
        "input": "列出所有有進行基金投資的個案資料",
        "query": """
        SELECT DISTINCT c.caseInfoId, c.caseInfoName, c.caseInfoPhone
        FROM case_info c
        INNER JOIN fund_invest f ON c.caseInfoId = f.caseInfoId;
        """
    },
    {
        "input": "查找某年度收入最高的前5名個案",
        "query": """
        SELECT c.caseInfoName, h.year, SUM(h.money) as total_income
        FROM case_info c
        JOIN household_year_financial_records h ON c.caseInfoId = h.caseInfoId
        WHERE h.year = 2024 AND h.financialCategory = '收入'
        GROUP BY c.caseInfoId
        ORDER BY total_income DESC
        LIMIT 5;
        """
    },
{
        "input": "列出所有進行中的投標記錄",
        "query": "SELECT * FROM bidding_records WHERE isDead = 'false';"
    },
    {
        "input": "查找特定個案的所有投標記錄",
        "query": """
        SELECT b.*, c.caseInfoName 
        FROM bidding_records b
        JOIN case_info c ON b.caseInfoId = c.caseInfoId
        WHERE b.caseInfoId = 'CASE001';
        """
    },
    # {
    #     "input": "查詢這個個案的經濟狀況",
    #     "query": """
    #         SELECT *
    #         FROM case_info c
    #         LEFT JOIN bidding_records b ON c.caseInfoId = b.caseInfoId
    #         LEFT JOIN fund_invest f ON c.caseInfoId = f.caseInfoId
    #         LEFT JOIN household_monthly_financial_records hm ON c.caseInfoId = hm.caseInfoId
    #         LEFT JOIN household_year_financial_records hy ON c.caseInfoId = hy.caseInfoId
    #         LEFT JOIN insurance_list i ON c.caseInfoId = i.caseInfoId
    #         LEFT JOIN stock_purchase_records s ON c.caseInfoId = s.caseInfoId
    #         WHERE c.caseInfoId = :caseInfoId;
    #     """
    # },
    {
        "input": "查找某個時間範圍內的投標記錄",
        "query": """
        SELECT * FROM bidding_records 
        WHERE startDate >= '2024-01-01' 
        AND startDate <= '2024-12-31';
        """
    },
    {
        "input": "查找每月額外投標金額超過特定數值的記錄",
        "query": """
        SELECT b.*, c.caseInfoName
        FROM bidding_records b
        JOIN case_info c ON b.caseInfoId = c.caseInfoId
        WHERE b.monthlyExtraBid > 5000;
        """
    },
    # Stock Purchase Records 相關查詢
    {
        "input": "列出某個案的所有股票持有紀錄",
        "query": """
        SELECT s.*, c.caseInfoName
        FROM stock_purchase_records s
        JOIN case_info c ON s.caseInfoId = c.caseInfoId
        WHERE s.caseInfoId = 'CASE001';
        """
    },
    {
        "input": "計算某個案的總持股數量和平均購買價格",
        "query": """
        SELECT stockCode,
               SUM(shares) as total_shares,
               AVG(averageBuyPrice) as avg_purchase_price
        FROM stock_purchase_records
        WHERE caseInfoId = 'CASE001'
        GROUP BY stockCode;
        """
    },
    {
        "input": "查找特定日期範圍內的股票購買紀錄",
        "query": """
        SELECT * FROM stock_purchase_records
        WHERE stockPurchaseDate BETWEEN '2024-01-01' AND '2024-12-31'
        ORDER BY stockPurchaseDate;
        """
    },
    {
        "input": "列出所有購買股數超過1000股的交易紀錄",
        "query": """
        SELECT s.*, c.caseInfoName
        FROM stock_purchase_records s
        JOIN case_info c ON s.caseInfoId = c.caseInfoId
        WHERE s.shares > 1000
        ORDER BY s.shares DESC;
        """
    },
    {
        "input": "查找某個股票代碼的所有購買紀錄及相關個案資訊",
        "query": """
        SELECT s.*, c.caseInfoName, c.caseInfoPhone
        FROM stock_purchase_records s
        JOIN case_info c ON s.caseInfoId = c.caseInfoId
        WHERE s.stockCode = '2330'
        ORDER BY s.stockPurchaseDate DESC;
        """
    }
]

system_prefix = """You are a SQL agent for database interactions.
Create syntactically correct {dialect} queries limited to {top_k} results.
Only request relevant columns and use only provided tools.
Double check queries before execution. If errors occur, rewrite and retry.
NO DML statements (INSERT, UPDATE, DELETE, DROP etc.).

KEY FIELDS:
- 'financialType': transaction type (income, expenditure, assets, liabilities)
- 'financialCategory': specific category of transaction

If question is unrelated to database, answer "I don't know".

Examples:"""