from typing import List, Dict, Literal, Union, Optional, Tuple
from langgraph.graph import MessagesState, StateGraph
from langgraph.constants import END, START
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from service.AI.baseService import BaseService
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType

class CustomState(MessagesState):
    case_id: str
    retrieve_result: List[Union[str, Document]]
    case_summary: str
    risk_assessment: Dict
    final_light: str 
    original_case_info: str

class IsWelfareQuestion(BaseModel):
    """判斷問題類型"""
    light: Literal["Red", "Orange", "Green"] = Field( 
        description="""
           根據final_report判斷是要返回哪種燈號：
           - Red: 高風險（6-10分）
           - Orange: 中風險（3-5分）  
           - Green: 低風險（0-2分）
        """
    )

class RiskService(BaseService):
    def __init__(self):
        super().__init__()
        
    def create_flow(self):

        def generate_case_info(state: CustomState):
            """獲取個案資訊並整合風險評估數據"""
            # 獲取原始資訊
            sql_content = self.query_by_sql(state['case_id'])
            audio_content = self.generate_caseInfo_by_audio(state['case_id'])

            if audio_content != '':
                original_info = self.organize_case_info(sql_content, audio_content)
                
                # 保存原始資訊
                state['original_case_info'] = original_info
                state['case_summary'] = original_info
            else:
                state['original_case_info'] = sql_content
                state['case_summary'] = sql_content
            
            return {
                "case_id": state['case_id'],
                "case_summary": state['case_summary'],
                "original_case_info": state['original_case_info'],
                "messages": state['messages']
            }
        
        def perform_risk_assessment(state: CustomState) -> CustomState:
            """执行风险评估，根据五个指标进行分析"""
            ai_model = self.chatModal
            
            # 风险评估提示模板
            system_prompt = """
            你是一個財務風險評估專家，需要根據個案資訊提取關鍵財務數據，並按照以下五個指標進行風險評估：
            
            一、收入穩定度/就業狀況
            分級：
            - 高度穩定（綠色）：有全職工作、每月固定入帳，持續六個月以上
            - 中低穩定（橘色）：打工、自營、兼職、不固定日期發薪，但持續性都會有收入
            - 不穩定（紅色）：無收入、靠家人微薄的零用金、不定時接案、臨時性支援
            
            二、負債壓力（負債比）
            分級：
            - 安全（綠色）：≤ 30%
            - 危險（橘色）：31% ~ 49%
            - 會被退件（紅色）：≥ 50%
            計算公式：前年的負債總額 ÷ 前年資產總額
            
            三、收支平衡情況（年度收支結餘）
            分級：
            - 安全（綠色）：儲蓄率 ≥ 10%
            - 注意（橘色）：儲蓄率 0% ~ 9%
            - 嚴重（紅色）：儲蓄率 < 0%
            計算公式：(去年收入 - 去年支出) ÷ 去年收入 × 100%
            
            四、資產淨值
            分級：
            - 安全（綠色）：≥ 5,000,000元
            - 注意（橘色）：1,000,000 ~ 4,999,999元
            - 危險（紅色）：< 1,000,000元
            計算公式：總資產 - 總負債 = 資產淨值
            
            五、扶養比（家庭扶養壓力）
            分級：
            - 安全（綠色）：≤ 1.0
            - 注意（橘色）：1.01 ~ 1.99
            - 危險（紅色）：≥ 2.0
            計算公式：被扶養人口 ÷ 有收入的人
            
            最終風險等級評估：
            - 紅燈為2分，橘燈為1分，綠燈為0分
            - 總分0～2分：綠燈（低風險）- 財務結構良好，無需緊急介入
            - 總分3～5分：橘燈（中風險）- 有潛在風險，建議定期追蹤或輔導
            - 總分6～10分：紅燈（高風險）- 財務極度不穩定，建議社工主動介入、安排資源協助
            
            以上數據請從個案資訊中提取，如果沒有明確的數據，請根據相關資訊進行合理推斷。
            
            請以下列格式返回評估結果（用文字敘述，不要使用JSON格式）：
            
            個案風險評估如下：
            
            一、收入穩定度為[紅色/橘色/綠色]（就業型態為[全職/兼職/無業等]，持續[X]個月）；
            
            二、負債壓力為[紅色/橘色/綠色]（去年總負債[X]元、去年總資產[Y]元，負債比為[Z]%）；
            
            三、收支平衡為[紅色/橘色/綠色]（去年總收入[X]元、去年總支出[Y]元，儲蓄率為[Z]%）；
            
            四、資產淨值為[紅色/橘色/綠色]（淨資產[X]元）；
            
            五、扶養比為[紅色/橘色/綠色]（[X]人有收入，[Y]人由個案扶養，扶養比為[Z]）。
            扶養比 = 被扶養人口 ÷ 有收入的人
            註1：這裡定義的扶養比(至少要有一人有收入)，指「實際需由個案提供生活支出的家庭成員（如子女、無收入者等）相對於家庭內有收入成員的人數比值」，用以衡量家庭內部的實際扶養壓力，並非主計總處發布的總扶養比算法，僅針對家庭層級進行評估。

            
            其中家庭成員如下：[列出家庭成員及其年收入]
            
            總風險分數：[計算紅燈(2分)、橘燈(1分)和綠燈(0分)的總分]
            
            整體風險等級：[依據總分判定為高風險(紅燈)/中風險(橘燈)/低風險(綠燈)]
            
            風險評估說明：[根據風險等級給出對應的說明，並綜合分析個案的整體財務風險狀況，重點關注紅色和橘色項目]
            
            以下是个案信息：
            {context}
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ('system', system_prompt)
            ])
            
            # 获取个案信息
            context_str = ""
            if state['case_summary']:
                context_str = state['case_summary']
            else:
                vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
                retrieve_result = vector_store.get_doc(file_name=state['case_id'])
                context = []
                if retrieve_result:
                    if isinstance(retrieve_result[0], str):
                        context = [retrieve_result[0]]
                    else:
                        context = [doc.page_content for doc in retrieve_result]
                context_str = "\n".join(context)
            
            chain = prompt | ai_model
            try:
                # 尝试获取结构化的风险评估结果
                result = chain.invoke({"context": context_str})
                parsed_result = _parse_risk_assessment(result.content)
                
                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "risk_assessment": parsed_result,
                }
            except Exception as e:
                # 如果解析失败，返回原始结果
                return {
                    "messages": state['messages'],
                    "case_summary": state['case_summary'],
                    "case_id": state['case_id'],
                    "risk_assessment": {"error": str(e), "raw_result": result.content if 'result' in locals() else "未获取结果"},
                }
        
        def format_final_report(state: CustomState) -> CustomState:
            """格式化最终风险评估报告"""
            ai_model = self.chatModal
            
            system_prompt = """
                請根據提供的個案資訊與風險評估數據，撰寫一份完整的風險評估報告，風格需符合「財務社工」專業語氣，並以 Markdown 格式呈現，內容結構如下：

                ## 報告結構要求：

                1. **個案基本情況概述**  
                - 簡要說明個案背景、職業、家庭成員等基本資料。

                2. **風險評估詳情（五項指標）**  
                逐項說明以下五個財務風險指標：
                - 收入穩定度  
                - 負債壓力(需列出計算過程)  
                - 收支平衡(需要列出計算過程)  
                - 資產淨值  
                - 扶養比  

                每項請列出：
                - 評級燈號（紅/橘/綠）  
                - 具體數值與計算過程（如適用）  
                - 評估理由與簡要說明

                3. **整體風險等級計算與說明**
                - 紅燈:2分、橘燈;1分、綠燈:0分
                - 評估總分後，根據下列等級判斷個案風險：
                    - 0~2分 → 低風險（綠燈）：財務穩定，無需緊急介入  
                    - 3~分 → 中風險（橘燈）：建議定期追蹤、提供輔導  
                    - 6~10分 → 高風險（紅燈）：建議社工主動介入、安排資源協助

                4. **改善建議**
                - 明確區分短期、中期、長期的建議措施（例如：節流、增收、債務整合等）

                5. **可利用的社會資源**
                - 舉例可搭配的補助、就業輔導、急難救助、心理支持等資源

                ## 實作限制條件：

                - 收入穩定度：**就業持續月數必須大於0**，若無資料，請註記為「未提供」並評估為紅燈
                - 負債比：不可為 0.0  
                - 若負債 ÷ 資產 = 0，請改寫為「沒有負債」  
                - 若資產為 0，請改寫為「無資產且有負債」，直接輸出總負債為多少
                - 每一項評估須**清楚列出原始數據與計算公式**
                - 每一項評估須**清楚列出該計算公式，如(總負債/ 總資產) x 100%**
                - **明確寫出判斷標準，把整個判斷標準放在計算出的值的後面**
                - 明確寫出「目前就業已持續 X 個月」，單位為**月**
                - 扶養比部分：**必須至少有1人有收入（即家庭中有至少1位成員有工作且有收入），若資料中無此情況，請明確註記「無工作收入者」，並以此評估扶養比與風險。**


                ##  語氣風格要求：

                - 語氣應專業、理性但易於理解  
                - 語言風格接近「社工報告」、「個案評估會議」的書面語  
                - 避免使用 AI 口吻（如：「我認為」「根據我的分析」）


            請使用繁體中文撰寫報告。
            
            個案資訊：
            {case_summary}
            
            風險評估結果：
            {risk_assessment}
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ('system', system_prompt)
            ])
            
            chain = prompt | ai_model
            result = chain.invoke({
                "case_summary": state['case_summary'],
                "risk_assessment": str(state['risk_assessment']),
            })
            
            # 将最终报告添加到消息中
            state['messages'].append({"role": "assistant", "content": result.content})
            
            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "risk_assessment": state['risk_assessment'],
            }
        
        def generate_final_light(state:CustomState)->CustomState:
            structured_llm = self.chatModal.with_structured_output(IsWelfareQuestion)

            res = structured_llm.invoke(input=state['risk_assessment']['raw_content'])

            state['final_light'] = res.light

            return {
                "messages": state['messages'],
                "case_summary": state['case_summary'],
                "case_id": state['case_id'],
                "risk_assessment": state['risk_assessment'],
                "final_light":state['final_light']
            }
        
        def _parse_risk_assessment(content: str) -> Dict:
            """解析LLM返回的風險評估結果，提取關鍵資訊"""
            
            # 由於我們現在使用文字敘述格式而非JSON，因此需要改變解析方式
            # 直接返回原始內容，讓後續步驟處理文字格式
            return {"raw_content": content}
        
        # 创建工作流
        work_flow = StateGraph(CustomState)
        
        # 添加节点
        work_flow.add_node('generate_case_info', generate_case_info)
        work_flow.add_node('perform_risk_assessment', perform_risk_assessment)
        work_flow.add_node('format_final_report', format_final_report)
        work_flow.add_node('generate_final_light',generate_final_light)
        
        # 添加边
        work_flow.add_edge(START, 'generate_case_info')
        work_flow.add_edge('generate_case_info', 'perform_risk_assessment')
        work_flow.add_edge('perform_risk_assessment', 'format_final_report')
        work_flow.add_edge('format_final_report', 'generate_final_light')
        work_flow.add_edge('generate_final_light',END)
        
        return work_flow.compile()