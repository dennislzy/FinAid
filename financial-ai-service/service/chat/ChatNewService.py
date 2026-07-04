from typing import List, Literal, Union
from langchain_community.agent_toolkits import create_sql_agent, SQLDatabaseToolkit
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.retrievers import ContextualCompressionRetriever, EnsembleRetriever
from langchain.retrievers.document_compressors import EmbeddingsFilter
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.retrievers import BM25Retriever
from langchain_community.utilities import SQLDatabase
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate, FewShotPromptTemplate, MessagesPlaceholder, PromptTemplate, \
    SystemMessagePromptTemplate
from langgraph.constants import END, START
from langgraph.graph import MessagesState, StateGraph
from pydantic import BaseModel, Field
from config import db_url, OPEN_AI_EMBEDDING
from modal.AIModal import AIModal
from service.chat.examples.data import examples, system_prefix
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
from service.chat.SQLService import SQLService
import logging

from utils.generate_case_util import generate_case_summary

# 配置日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NameResponse(BaseModel):
    case_name:str = Field(
        description= "個案姓名"
    )

class CustomState(MessagesState):
    case_summary:str
    audio_case_summary:str
    case_id:str
    suggestion:str
    question:str
    retrieve_result:List[Union[str, Document]]

class IsWelfareQuestion(BaseModel):
    """判斷問題類型"""
    
    question_type: Literal["subsidy_status", "risk_assessment", "general"] = Field(
        description="""
            判斷問題類型：
            'subsidy_status'：'當問題中出現「補助」、「津貼」、「福利」等相關字詞時選擇此類型'
            'risk_assessment'：'當問題中出現「風險」、「評估」、「分析」、「危機」等相關字詞時選擇此類型'
            'general'：'當問題不屬於上述兩種類型時選擇此類型'
        """
    )

class ChatNewService(AIModal):
    def create_flow(self):
    
        # 初始步驟判斷函數：決定走哪個主分支
        def determine_initial_step(state:CustomState):
            """判斷初始步驟：走福利評估路線還是一般RAG路線"""
            structured_llm = self.chatModal.with_structured_output(IsWelfareQuestion)
            try:
                res = structured_llm.invoke(input=state['messages'][-1].content)
                print('res',res.question_type)
                if res.question_type in ['subsidy_status', 'risk_assessment']:
                    print("問題類型為:", res.question_type, "走標準福利評估流程")
                    return 'welfare_route'  # 走補助或風險評估相關流程
                else:
                    print("問題類型為一般查詢，走RAG流程")
                    return 'rag_route'  # 走一般RAG流程
            except Exception as e:
                print(f"問題類型判斷出錯: {e}，默認走標準流程")
                return 'welfare_route'  # 異常情況也走標準流程
        
        # RAG 生成回應函數 (獨立於福利評估流程)
        def generate_rag(state:CustomState)->CustomState:
            """使用RAG回答一般性問題"""
            sql_service = SQLService()
            res = sql_service.answer_by_sql(case_id=state['case_id'],question_str=state['messages'][-1].content)
            return {
                "messages": state['messages'],
                "case_summary": state.get('case_summary', ''),
                "case_id": state['case_id'],
                "suggestion": res['output'],  # 將RAG生成的回應放入suggestion欄位
                "question": state['messages'][-1].content,
                "retrieve_result": []
            }
        
        # 查詢sql 内個案資料
        def query_by_sql(state:CustomState)->CustomState:
            case_summary = generate_case_summary(case_info_id=state['case_id'])
            state['case_summary'] = case_summary
            
            # 將查詢結果存入狀態（不再需要條件判斷，一律傳遞到下一步）
            if case_summary == '未找到相關個案資訊':
                state['retrieve_result'] = []
            else:
                state['retrieve_result'] = [case_summary]
                
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": "",
                "question": "",
                "retrieve_result": state['retrieve_result']
            }
        
        # 產生個案基本信息(撈音儅資料)
        def generate_caseInfo_by_audio(state:CustomState)->CustomState:
            # 無論之前的查詢結果如何，都嘗試獲取資料
            vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
            ai_model = self.chatModal
            system = """
            根據以下的財務諮詢訪談記錄，請回答我的問題：
            1. 這位客戶的基本資料是什麼？
            2. 是否為原住民，是否具有福利證明，是否是身心障礙人士,是否為中低收入戶
            3. 客戶的主要年/月收入來源和金額是多少？
            4. 客戶的保險狀況如何？
            5. 標會記錄
            6. 基金投資記錄
            7. 股票投資記錄
            {context}
            如果找不到資訊就説，找不到任何有關這個個案的任何資料
            """
            prompt = ChatPromptTemplate.from_messages([
                ('system', system)
            ])
            retrieve_result = vector_store.get_doc(file_name=state['case_id'])
            
            # 更新retrieve_result而不是覆蓋它
            if retrieve_result:
                if isinstance(state['retrieve_result'], list):
                    state['retrieve_result'].extend(retrieve_result)
                else:
                    state['retrieve_result'] = retrieve_result
            
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
            state['audio_case_summary'] = res.content

            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "audio_case_summary": state['audio_case_summary'],
                "suggestion": "",
                "question": "",
                "retrieve_result": state['retrieve_result']
            }
        
        # Organize case info - consolidate data from SQL and audio sources
        def organize_case_info(state: CustomState) -> CustomState:
            """
            整合並整理來自SQL和音檔的個案資訊。
            當兩個來源的資訊有衝突時，優先使用SQL資料。
            """
            ai_model = self.chatModal
            
            # 如果沒有SQL或音檔資料，返回原始狀態
            if not state.get('case_summary') and not state.get('audio_case_summary'):
                logger.warning("沒有找到任何個案資料，無法整理")
                return {
                    "messages": state['messages'],
                    "case_summary": state.get('case_summary', ''),
                    "case_id": state['case_id'],
                    "suggestion": "",
                    "question": "",
                    "retrieve_result": state['retrieve_result']
                }
            
            # 如果只有SQL資料，直接使用
            if state.get('case_summary') and state['case_summary'] != '未找到相關個案資訊' and not state.get('audio_case_summary'):
                logger.info("只有SQL資料，直接使用SQL資料")
                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "suggestion": "",
                    "question": "",
                    "retrieve_result": state['retrieve_result']
                }
            
            # 如果只有音檔資料，直接使用
            if (not state.get('case_summary') or state['case_summary'] == '未找到相關個案資訊') and state.get('audio_case_summary'):
                logger.info("只有音檔資料，直接使用音檔資料")
                return {
                    "messages": state['messages'],
                    "case_summary": state['audio_case_summary'],  # 使用音檔資料作為case_summary
                    "case_id": state['case_id'],
                    "suggestion": "",
                    "question": "",
                    "retrieve_result": state['retrieve_result']
                }
            
            # 如果兩者都有，需要整合資料
            logger.info("同時有SQL和音檔資料，開始整合")
            
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
            3. 確保整合後的資料包含：基本個人資料、收入來源及金額、福利狀態（是否原住民/身心障礙/中低收入戶等）、保險狀況、投資情況
            5. 不要標明資料來源，直接整合為一份完整文檔
            
            請生成一份完整、一致且結構化的個案總結。
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ('system', system)
            ])
            
            chain = prompt | ai_model
            
            # 整合資料
            integrated_summary = chain.invoke({
                "sql_data": state['case_summary'],
                "audio_data": state['audio_case_summary']
            }).content
            
            logger.info("資料整合完成")

            print('inte',integrated_summary)
            
            # 更新狀態
            return {
                "messages": state['messages'],
                "case_summary": integrated_summary,  # 更新為整合後的資料
                "case_id": state['case_id'],
                "suggestion": "",
                "question": "",
                "retrieve_result": state['retrieve_result']
            }
        
        # 判斷問題類型
        def check_question_type(state:CustomState):
            """判斷問題類型并返回路由目標"""
            structured_llm = self.chatModal.with_structured_output(IsWelfareQuestion)
            res = structured_llm.invoke(input=state['messages'][-1].content)
            if res.question_type == 'risk_assessment':
                return 'generate_risk_assessment'
            else:
                return 'evaluate_welfare_eligibility'
        
        # 作為一個節點的問題類型檢查（非路由函數）
        def check_question_node(state:CustomState)->CustomState:
            """作為節點的問題類型檢查，直接傳遞狀態"""
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": "",
                "question":"",
                "retrieve_result":state['retrieve_result']
            }
        
        # 評估是否有足夠資料進行福利查詢（路由函數)
        def welfare_eligibility_router(state: CustomState):
            """評估是否有足夠資料進行福利查詢"""
            if isinstance(state['retrieve_result'], list) and len(state['retrieve_result']) > 0:
                print("有找到案例資料，繼續處理福利推薦")
                return "generate_by_welfare"
            else:
                print("未找到案例資料，結束流程")
                return 'not_found_node'  # 重要: 返回節點名稱而非字符串常量
        
        # 產生風險評估，判斷個案入不敷出因素
        def generate_risk_assessment(state:CustomState)->CustomState:
            vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
            ai_model = self.chatModal
            system = """
            幫我分析這個個案有哪些因素使它入不敷出並給他簡單的改善建議 以下為個案資料
            {context}
            """
            prompt = ChatPromptTemplate.from_messages([
                ('system', system)
            ])
            context_str = ""
            if state['case_summary']:
                context_str = state['case_summary']  # 直接使用case_summary
            else:
                retrieve_result = vector_store.get_doc(file_name=state['case_id'])
                context = []
                if retrieve_result:
                    if isinstance(retrieve_result[0], str):
                        context = [retrieve_result[0]]
                    else:
                        context = [doc.page_content for doc in retrieve_result]
                context_str = "\n".join(context)
            
            chain = prompt | ai_model
            res = chain.invoke({"context": context_str}).content
            
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": res,
                "question":"",
                "retrieve_result":state['retrieve_result']
            }
        
        # 評估福利資格（節點函數，不是路由函數）
        def evaluate_welfare_eligibility(state:CustomState)->CustomState:
            # 這個函數只是轉發狀態，實際路由邏輯在 welfare_eligibility_router 中
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": "",
                "question":"",
                "retrieve_result":state['retrieve_result']
            }
        
        # 沒找到案例資料（節點函數）
        def not_found_node(state:CustomState)->CustomState:
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": '系統宕機,稍後將爲您聯係客服，智財幫祝您有個美好的一天',
                "question":"",
                "retrieve_result":state['retrieve_result']
            }
        
        # 查詢補助資訊并給最終建議
        def generate_by_welfare(state:CustomState) -> CustomState:
            vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
            ai_model = self.chatModal
            
            # 處理case_summary，確保轉換為Document對象
            if state['case_summary']:
                b25_retriever = BM25Retriever.from_documents(
                    documents=[Document(page_content=state['case_summary'])],
                )
                b25_retriever.k = 6
                
                retriever_from_llm = EnsembleRetriever(
                    retrievers=[
                        b25_retriever, 
                        vector_store.create_retriever(
                            search_type="similarity",
                            search_kwargs={"filter": {"file_name": 'welfare.md'}}
                        )
                    ],
                    weights=[0.5, 0.5]
                )

                response = retriever_from_llm.invoke(state['case_summary'])

                if len(response) == 0:
                    return {
                        "messages": state['messages'],
                        "case_summary": state['case_summary'],
                        "case_id": state['case_id'],
                        "suggestion": '系統宕機,稍後將爲您聯係客服，智財幫祝您有個美好的一天',
                        "question":"",
                        "retrieve_result":state['retrieve_result']
                    }
                else:
                    result = "\n".join([d.page_content for d in response])
                    print('result',result)
                    system = """
                    你是一個專業的社工，請根據以下信息為個案推薦合適的政府補助：

                    個案資料：
                    {case_info}

                    可用的補助政策：
                    {relevant_policies}

                    請遵循以下原則：
                    1. 先從個案資料中整理並說明個案的「年收入」與「月收入」，若無資料請說明找不到。
                    2. 仔細分析每項補助政策的福利説明。
                    3. 個案必須符合福利説明中列出的所有條件才能被推薦該項補助。
                    4. 如果判斷不符合補助條件申請，則不列出該項補助。
                    """
                    prompt = PromptTemplate.from_template(system)

                    chain = prompt | ai_model

                    suggestion = chain.invoke({"case_info": state['case_summary'], "relevant_policies": result}).content

                    return {
                        "messages": state['messages'],
                        "case_summary": state['case_summary'],
                        "case_id": state['case_id'],
                        "suggestion": suggestion,
                        "question":"",
                        "retrieve_result":state['retrieve_result']
                    }
            else:
                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "suggestion": '未找到足夠的個案資料進行福利推薦',
                    "question":"",
                    "retrieve_result":state['retrieve_result']
                }
        
        # 建立工作流程
        work_flow = StateGraph(CustomState)

        # 添加所有節點
        work_flow.add_node('query_by_sql', query_by_sql)
        work_flow.add_node('generate_caseInfo_by_audio', generate_caseInfo_by_audio)
        work_flow.add_node('organize_case_info', organize_case_info)
        work_flow.add_node('generate_risk_assessment', generate_risk_assessment)
        work_flow.add_node('evaluate_welfare_eligibility', evaluate_welfare_eligibility)
        work_flow.add_node('generate_by_welfare', generate_by_welfare)
        work_flow.add_node('not_found_node', not_found_node)
        work_flow.add_node('check_question_node', check_question_node)
        work_flow.add_node('generate_rag', generate_rag)

        # 判斷初始步驟：福利評估流程還是RAG流程
        work_flow.add_conditional_edges(
            START,
            determine_initial_step,
            {
                'welfare_route': 'query_by_sql',
                'rag_route': 'generate_rag'
            }
        )
        
        # RAG流程直接到END
        work_flow.add_edge('generate_rag', END)
        
        # 福利評估流程的線性路徑
        work_flow.add_edge('query_by_sql', 'generate_caseInfo_by_audio')
        work_flow.add_edge('generate_caseInfo_by_audio', 'organize_case_info')
        work_flow.add_edge('organize_case_info', 'check_question_node')
        
        # 根據問題類型進行路由
        work_flow.add_conditional_edges(
            'check_question_node',
            check_question_type,
            {
                'generate_risk_assessment': 'generate_risk_assessment',
                'evaluate_welfare_eligibility': 'evaluate_welfare_eligibility'
            }
        )
        
        # 根據是否有資料進行路由
        work_flow.add_conditional_edges(
            'evaluate_welfare_eligibility',
            welfare_eligibility_router,
            {
                'generate_by_welfare': 'generate_by_welfare',
                'not_found_node': 'not_found_node'
            }
        )
        
        # 結束點連接
        work_flow.add_edge('generate_by_welfare', END)
        work_flow.add_edge('generate_risk_assessment', END)
        work_flow.add_edge('not_found_node', END)

        return work_flow.compile()
    
    # 方法1: 直接打印 Mermaid 代碼
    def print_mermaid_code(self):
        """獲取並打印 mermaid 代碼"""
        try:
            # 獲取 mermaid 格式的圖
            mermaid_code = self.create_flow().get_graph().draw_mermaid()
            
            print("=== Mermaid 代碼 ===")
            print(mermaid_code)
            print("========================")
            print("您可以將此代碼粘貼到 https://mermaid.live/ 查看可視化結果")
            return mermaid_code
        except Exception as e:
            print(f"生成 mermaid 代碼失敗: {e}")
            return None

        # 方法2: 簡單列出所有節點和邊
    def print_simple_structure(self):
        """簡單列出圖的節點和邊"""
        try:
            graph_obj = self.create_flow().get_graph()
            
            print("=== 圖節點 ===")
            for node in graph_obj.nodes():
                print(node)
            
            print("\n=== 圖普通邊 ===")
            for edge in graph_obj.edges():
                print(f"{edge[0]} -> {edge[1]}")
            
            # 如果有條件邊
            if hasattr(graph_obj, "conditional_edges") and graph_obj.conditional_edges:
                print("\n=== 圖條件邊 ===")
                for source, targets in graph_obj.conditional_edges.items():
                    for condition, target in targets.items():
                        print(f"{source} --({condition})--> {target}")
            
            return True
        except Exception as e:
            print(f"列出圖結構失敗: {e}")
            return False

        # 在服務類中添加可視化方法
    def create_flow_with_visualization(self):
        """創建流程並打印可視化代碼"""
        # 創建並編譯流程
        compiled_graph = self.create_flow()

        # 嘗試直接打印 Mermaid 代碼
        try:
            self.print_mermaid_code()
        except Exception as e:
            print(f"生成 Mermaid 代碼失敗: {e}")
            # 嘗試使用簡單列出結構的方法
            try:
                self.print_simple_structure()
            except Exception as e2:
                print(f"列出圖結構也失敗了: {e2}")

        return compiled_graph


# # 使用
# service = ChatNewService()
# flow = service.create_flow_with_visualization()
