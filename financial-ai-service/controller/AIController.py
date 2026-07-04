from fastapi import APIRouter
from pydantic import BaseModel

from service.AI.riskService import RiskService
from service.AI.welfareService import WelfareService

 
class QuestionRequest(BaseModel):
    message: str


router = APIRouter(prefix="/api/ai", tags=['evaluation'])


@router.post('/welfare/{case_id}')
async def generate_welfare(case_id:str,message:QuestionRequest):

    welfare_service = WelfareService()

    work_flow = welfare_service.create_flow()

    res = work_flow.invoke({"messages":message.message,"case_id":case_id})

    return {
        "case_summary":res['case_summary'],
        "suggestion":res['suggestion']
    }

@router.post('/riskment/{case_id}')
async def generate_riskment(case_id:str,message:QuestionRequest):
    risk_service = RiskService()

    work_flow = risk_service.create_flow()

    res = work_flow.invoke({"messages":message.message,"case_id":case_id,"original_case_info":message.message})

    return {
        "risk":res['risk_assessment']['raw_content'],
        "light":res['final_light']
    }

