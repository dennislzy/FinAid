from typing import List, Union
from langchain_core.documents import Document
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
from service.AI.baseService import BaseService
from langgraph.graph import MessagesState, StateGraph
from langchain.retrievers import ContextualCompressionRetriever, EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_core.prompts import PromptTemplate
from langgraph.constants import END, START
from langchain.output_parsers import JsonOutputToolsParser
class CustomState(MessagesState):
    case_id:str
    retrieve_result:List[Union[str, Document]]
    case_summary:str
    suggestion:List

class WelfareService(BaseService):

    def create_flow(self):

        def generate_case_info(state:CustomState):

            sql_content = self.query_by_sql(state['case_id'])
            audio_content = self.generate_caseInfo_by_audio(state['case_id'])
            print('sql',sql_content)
            if audio_content != '':
                if sql_content == '':
                    # 保存原始資訊
                    state['original_case_info'] = audio_content
                    state['case_summary'] = audio_content
                else:
                    original_info = self.organize_case_info(sql_content, audio_content)
                    state['original_case_info'] = original_info
                    state['case_summary'] = original_info
            else:
                state['original_case_info'] = sql_content
                state['case_summary'] = sql_content

            return {
                "case_id":state['case_id'],
                "case_summary":state['case_summary'],
                "messages":state['messages']
            }
        

        def generate_by_welfare(state: CustomState) -> CustomState:
            vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
            ai_model = self.chatModal
            if not state['case_summary']:
                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "suggestion": '完了barbecue了'
                }
            
            # 1. 使用LLM生成多角度查詢以提高召回率
            query_generation_prompt = """
            根據以下個案資料，生成5個不同角度的查詢語句，以便找到所有可能的補助項目。
            每個查詢語句應該專注於個案的不同特點（如年齡、家庭狀況、收入水平、特殊身份,申請原住民急難救助，申請急難救助）。
            
            個案資料：
            {case_summary}
            
            返回5個不同的查詢語句
            """
            query_gen_template = PromptTemplate.from_template(query_generation_prompt)
            query_gen_chain = query_gen_template | ai_model  
            try:
                # 生成多個查詢
                multiple_queries = []
                multiple_queries = [query_gen_chain.invoke({"case_summary": state['case_summary']}).content]
                # 添加原始查詢確保基本匹配
                multiple_queries.append(state['case_summary'])
            except Exception as e:
                # 生成失敗時回退到僅使用原始查詢
                multiple_queries = [state['case_summary']]
            
            # 2. 使用多查詢策略進行檢索
            all_results = []
            
            # 原始文檔用於BM25檢索
            case_doc = Document(page_content=state['case_summary'])
            
                # 進行檢索
            results = vector_store.search(
                query=state['case_summary'],
                filter={
                    "file_name": "welfare.md"
                }
            )
            all_results.extend(results)
            
            result3 = vector_store.get_doc_by_id(["7368de8c-92ca-4e14-9993-77c2b7243be7"])
            result5 = vector_store.get_doc_by_id(['508d4644-dc97-4e0e-8f43-aa094621e595'])
            if "是否為原住民：是" in state['case_summary']:
                result4 = vector_store.get_doc_by_id(["711780f5-6f4b-49c0-8e27-57bd2ca53578"])
                all_results.extend(result4)
            all_results.extend(result3)
            all_results.extend(result5)
            
            # 3. 去重並保留最相關的結果
            unique_results = {}
            for doc in all_results:
                # 使用內容的前100個字符作為唯一標識符
                key = doc.page_content[:100]
                if key not in unique_results:
                    unique_results[key] = doc
            
            # 如果結果為空，返回錯誤信息
            if len(unique_results) == 0:
                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "suggestion": '完了barbecue了',
                }
            
            # 組合所有獨特的結果
            result_content = "\n\n".join([doc.page_content for doc in unique_results.values()])
            
            # 4. 優化提示詞，強制模型考慮所有補助
            system = """
            你是一個專業的社工，請根據以下信息全面分析為個案推薦所有可能適用的政府補助：

            個案資料：
            {case_info}

            可用的補助政策：
            {relevant_policies}

            請遵循以下原則：
            1. 非常仔細地分析每一項補助政策的福利説明和申請條件。
            2. 請勿將兩個補助的金額混在一起，低收入戶的補助只給出低收入戶的金額，身心障礙補助就列在身心障礙補助的地方
            3. 逐一檢查每項補助，即使看起來不太相關也要評估。
            4. 對於每項補助，列出其所有條件，然後分析個案是否符合。
            5. 如果對某條件的滿足情況不確定，請保守地假設個案可能符合條件。
            6. 請使用表格列出所有推薦的補助，包含補助名稱、主要條件和預估補助金額。
            7. 將個案的上個月總收入列出，來證明為什麼他可以領取補助，解釋他的總收入小於可領取的補助規定金額，所以可以領
            8. 寫出金額是否有符合可以領取補助的規定
            9. 最後，提供一個總結，說明個案可能符合條件的所有補助數量和種類。
            """
            prompt = PromptTemplate.from_template(system)
            chain = prompt | ai_model
            
            suggestion = chain.invoke({
                "case_info": state['case_summary'], 
                "relevant_policies": result_content
            }).content 
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "suggestion": suggestion,
            }
        
        work_flow = StateGraph(CustomState)

        work_flow.add_node('generate_case_info',generate_case_info)
        work_flow.add_node('generate_by_welfare',generate_by_welfare)


        work_flow.add_edge(START,'generate_case_info')
        work_flow.add_edge('generate_case_info','generate_by_welfare')
        work_flow.add_edge('generate_by_welfare',END)

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
