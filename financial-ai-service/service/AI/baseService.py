from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
from modal.AIModal import AIModal
from utils.generate_case_util import generate_case_summary
from langchain_core.prompts import ChatPromptTemplate

class BaseService(AIModal):
    
    # 查詢sql 内個案資料
    def query_by_sql(self,case_id:str)->str:
        case_summary = generate_case_summary(case_id)
        return case_summary

    # 產生個案基本信息(撈音儅資料)
    def generate_caseInfo_by_audio(self,case_info_id:str)->str:
        # 無論之前的查詢結果如何，都嘗試獲取資料
        vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
        ai_model = self.chatModal
        system = """
        根據以下的財務諮詢訪談記錄，請回答我的問題：
        1. 這位客戶的基本資料是什麼？
        2. 是否為原住民，是否具有福利證明，是否是身心障礙人士,是否為中低收入戶
        3. 客戶的主要年/月收入來源和金額是多少？
        4. 客戶的主要年/月支出來源和金額是多少？
        5. 客戶的保險狀況如何？
        6. 標會記錄
        7. 基金投資記錄
        8. 股票投資記錄
        9.總負債/縂資產是多少
        {context}
        如果找不到資訊就説，找不到任何有關這個個案的任何資料
        """
        prompt = ChatPromptTemplate.from_messages([
            ('system', system)
        ])
        retrieve_result = vector_store.get_doc(file_name=case_info_id)

        print('re',retrieve_result)
        
        # 處理不同類型的retrieve_result
        context = []
        if retrieve_result:
            if isinstance(retrieve_result[0], str):
                # 如果是字符串列表
                context = [retrieve_result[0]]
            else:
                # 如果是Document對象列表
                context = [doc.page_content for doc in retrieve_result]
        
            context_str = "\n".join(context)
            chain = prompt | ai_model

            res = chain.invoke({"context": context_str})

            return res.content
        else:
            return ''
    
    # Organize case info - consolidate data from SQL and audio sources
    def organize_case_info(self,sql_content:str,audio_content:str) -> str:
        """
        整合並整理來自SQL和音檔的個案資訊。
        當兩個來源的資訊有衝突時，優先使用SQL資料。
        """
        ai_model = self.chatModal
        
        # 使用LLM整合資料，優先使用SQL資料
        system = """
        請整合以下兩個來源的個案資料，生成一份完整的個案總結：
        
        資料來源1（SQL資料庫）：
        {sql_data}
        
        資料來源2（音檔分析）：
        {audio_data}
        
        整合規則：
        1. 當兩個來源的資料有衝突時，優先使用資料來源1（SQL資料庫）的資訊
        2. 當資料來源1沒有提供某項資訊，但資料來源2有提供時，使用資料來源2的資訊
        3.sql 產生的所有資料内容要完全保留
        
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ('system', system)
        ])
        
        chain = prompt | ai_model
        
        # 整合資料
        integrated_summary = chain.invoke({
            "sql_data": sql_content,
            "audio_data": audio_content
        }).content

        return integrated_summary