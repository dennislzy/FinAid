from typing import List, Literal
from langchain_community.agent_toolkits import create_sql_agent, SQLDatabaseToolkit
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.retrievers import ContextualCompressionRetriever, EnsembleRetriever
from langchain.retrievers.document_compressors import EmbeddingsFilter
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.retrievers import BM25Retriever
from langchain_community.utilities import SQLDatabase
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_core.prompts import ChatPromptTemplate, FewShotPromptTemplate, MessagesPlaceholder, PromptTemplate, \
    SystemMessagePromptTemplate
from langgraph.constants import END, START
from langgraph.graph import MessagesState, StateGraph
from pydantic import BaseModel, Field
from config import db_url, OPEN_AI_EMBEDDING
from modal.AIModal import AIModal
from service.chat.examples.data import examples, system_prefix
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
import logging

# 配置日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
class CheckQuestion(BaseModel):
    """判斷問題類型"""
    
    question_type: Literal["subsidy_status", "risk_assessment", "basic_info_finance"] = Field(
        description="""
            判斷問題類型：
            'subsidy_status'：'當問題中出現「補助」、「津貼」、「福利」等相關字詞時選擇此類型'
            'risk_assessment'：'當問題中出現「風險」、「評估」、「分析」、「危機」等相關字詞時選擇此類型'
            'basic_info_finance'：'當問題不屬於上述兩類時，歸類為基本資料與財務相關問題'
        """
    )

class IsSocialQuestion(BaseModel):
    isSocial:bool = Field(
        description="判斷問題類型：問題是否是否為財務社工詢問輔導個案相關問題"
    )
class NameResponse(BaseModel):

    case_name:str = Field(
        description= "個案姓名"
    )

class CustomState(MessagesState):
    case_summary:str
    case_id:str
    suggestion:str
    question:str
    retrieve_result:List[str]

class ChatService(AIModal):
    db = SQLDatabase.from_uri(db_url)
    def create_flow(self):

        def check_isSocial(state:CustomState):
            structured_llm = self.chatModal.with_structured_output(IsSocialQuestion)
            res = structured_llm.invoke(input=state['messages'][-1].content)
            if res.isSocial == True:
                return 'rewrite_question'
            else:
                return 'other_question'
        
        def other_question(state:CustomState)->CustomState:
            prompt = ChatPromptTemplate.from_messages([
                ('system', '你是專業的財務社工，如果個案問題不是財務社工專業領域的，就回答：抱歉，我只能回答財務社工領域相關知識。'),
                ('user', '{context}')
            ])
            chain = prompt | self.chatModal

            answer = chain.invoke({"context":state['messages'][-1].content}).content
            state['suggestion'] =answer
            return {
                "suggestion":state['suggestion'],
                "case_summary":"",
                "case_id":state['case_id'],
                'messages':state['messages'],
                "question":'',
                "retrieve_result":[]
            }

        #判斷問題類型
        def decide_to_answer(state:CustomState):
            structured_llm = self.chatModal.with_structured_output(CheckQuestion)
            res = structured_llm.invoke(input=state['messages'])
            print('res',res.question_type)
            if res.question_type == 'subsidy_status':
                return "generate_caseInfo"
            elif res.question_type == 'risk_assessment':
                return "generate_risk_assessment"
            else:
                return "generate_by_sql"
            
        #查詢基本資料
        def generate_by_sql(state:CustomState)->CustomState:
            example_selector = SemanticSimilarityExampleSelector.from_examples(
                examples,
                OPEN_AI_EMBEDDING,
                FAISS,
                k=5,
                input_keys=["input"],
            )
            few_shot_prompt = FewShotPromptTemplate(
                example_selector=example_selector,
                example_prompt=PromptTemplate.from_template(
                    "User input: {input}\nSQL query: {query}"
                ),
                input_variables=["input", "dialect", "top_k"],
                prefix=system_prefix,
                suffix="",
            )

            full_prompt = ChatPromptTemplate.from_messages(
                [
                    SystemMessagePromptTemplate(prompt=few_shot_prompt),
                    ("human", "{input}"),
                    MessagesPlaceholder("agent_scratchpad"),
                ]
            )

            executor = create_sql_agent(
                llm=self.chatModal,
                toolkit=SQLDatabaseToolkit(db=self.db, llm=self.chatModal),
                verbose=True,
                prompt=full_prompt,
                agent_type="openai-tools",
            )
            question = state['case_id'] + " " + state['question']
            result = executor.invoke(question)
            state['suggestion'] = result.get("output", "")
            return {
                "suggestion":state['suggestion'],
                "case_summary":"",
                "case_id":state['case_id'],
                'messages':state['messages'],
                "question":'',
                "retrieve_result":[]
            }
        
        def generate_by_rag(state:CustomState):
            vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
            retrieve_result = vector_store.search(query=state['messages'][-1].content,filter={"file_name": state['case_id']})
            print('res',retrieve_result)
            context = [doc.page_content for doc in retrieve_result]
            context_str = "\n".join(context)
            system = """
            根據提供的資料幫我回答用戶所問的問題
            {question}
            内文
            {context}
              """
            prompt = ChatPromptTemplate.from_messages([
                ('system', system)
            ])
            chain = prompt | self.chatModal

            res = chain.invoke({"context": context_str,"question":state["messages"][-1].content}).content

            return {
                "messages": state['messages'],
                "case_summary": "",
                "case_id": state['case_id'],
                "suggestion": res,
                "question":"hi",
                "retrieve_result":[]
            }
        
        #產生風險評估，判斷個案入不敷出因素
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
            retrieve_result = vector_store.get_doc(file_name=state['case_id'])
            context = [doc.page_content for doc in retrieve_result]
            context_str = "\n".join(context)
            print('res',context_str)
            chain = prompt | ai_model
            res = chain.invoke({"context": context_str}).content
            state['suggestion'] = res
            return {
                "messages": state['messages'],
                "case_summary": "",
                "case_id": state['case_id'],
                "suggestion": res,
                "question":"hi",
                "retrieve_result":[]
            }
        
        #產生個案基本信息
        def generate_caseInfo(state:CustomState)->CustomState:
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
            print('retrieve',retrieve_result)
            state['retrieve_result'] = retrieve_result
            # 从元组中提取文档内容
            context = [doc.page_content for doc in retrieve_result]
            context_str = "\n".join(context)
            chain = prompt | ai_model

            res = chain.invoke({"context": context_str})

            state['case_summary'] = res.content

            return {
                "messages":state['messages'],
                "case_summary":state['case_summary'],
                "case_id":state['case_id'],
                "suggestion":"",
                "question":"",
                "retrieve_result":state['retrieve_result']
            }
        
        #判斷有沒有個案資料，有則去查詢補助
        def decide_to_go_welfare(state: CustomState):
            if len(state['retrieve_result']) >0:  # If we have results
                print("有找到案例資料，繼續處理福利推薦")
                return "generate_by_welfare"
            else:
                print("未找到案例資料，結束流程")
                return 'not_found'
        
        #沒找到案例資料
        def  not_found(state:CustomState)->CustomState:
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": '系統宕機,稍後將爲您聯係客服，智財幫祝您有個美好的一天',
                "question":"",
                "retrieve_result":state['retrieve_result']
            }
        
        #查詢補助資訊并給最終建議
        def generate_by_welfare(state:CustomState) -> CustomState:
            vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
            ai_model = self.chatModal
            b25_retriever = BM25Retriever.from_documents(
                documents=[Document(page_content=state['case_summary'])],
            )
            b25_retriever.k = 6
            retriever_from_llm = EnsembleRetriever(
                retrievers=[
                    b25_retriever, 
                    vector_store.create_retriever(
                        search_type="similarity",  # 必须指定search_type
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

                state['suggestion'] = suggestion

                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "suggestion": state['suggestion'],
                    "question":"",
                    "retrieve_result":state['retrieve_result']
                }

        work_flow = StateGraph(CustomState)

        work_flow.add_node("generate_caseInfo",generate_caseInfo)
        work_flow.add_node("generate_by_welfare",generate_by_welfare)
        work_flow.add_node("generate_by_sql",generate_by_rag)
        work_flow.add_node("generate_risk_assessment",generate_risk_assessment)
        work_flow.add_node('not_found',not_found)
       

        work_flow.add_conditional_edges(
            START,
            decide_to_answer,
            {"generate_caseInfo":"generate_caseInfo","generate_by_sql":"generate_by_sql","generate_risk_assessment":"generate_risk_assessment"}
        )

        #撈sql基本資料
        work_flow.add_edge("generate_by_sql",END)

        #撈音儅產生補助資料
        work_flow.add_conditional_edges(
            "generate_caseInfo",
            decide_to_go_welfare,
            {"generate_by_welfare":"generate_by_welfare",'not_found':'not_found'}
        )
        work_flow.add_edge("generate_by_welfare",END)

        work_flow.add_edge('not_found',END)

        #產生個案風險評估資料
        work_flow.add_edge("generate_risk_assessment",END)

        return  work_flow.compile()
    
    def simple_chat(self,content):

        ai_model = self.chatModal

        content = ai_model.invoke(content).content

        return {
            "content":content,
            "totalTokens":100,
            "responseTime":2.0
        }
