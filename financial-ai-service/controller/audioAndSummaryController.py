import os
import tempfile
import config
from datetime import datetime
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI

from service.audioToTextService import AudioToTextService
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
from utils.splitterUtil import split_datas
from langchain_core.documents import Document

router = APIRouter(prefix="/api/ai", tags=['audio'])

# 從環境變數讀取 API Key,不要寫死在程式碼裡
client = OpenAI(api_key=config.OPEN_AI_KEY)

# 可透過環境變數切換模型,方便之後比較 whisper-1 跟 gpt-4o-mini-transcribe 的效果
TRANSCRIBE_MODEL = os.environ.get("OPENAI_TRANSCRIBE_MODEL", "whisper-1")


class AudioTextRequest(BaseModel):
    audioTexts: str


class FileRequest(BaseModel):
    file_path: str


class SummaryRequest(BaseModel):
    summaryTexts: str
    fileName: str


@router.post("/audio/{case_name}")
async def audioToText(audio_file: UploadFile = File(...), case_name: str = None):
    audio_service = AudioToTextService(None)

    try:
        start_time = datetime.now()

        # 檢查檔案類型
        if not audio_file.content_type.startswith('audio/'):
            return JSONResponse(
                status_code=400,
                content={"error": "請上傳音頻文件"}
            )

        # 建立臨時檔案存放上傳的音頻(OpenAI SDK 需要檔案物件或路徑)
        suffix = os.path.splitext(audio_file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            content = await audio_file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        try:
            with open(temp_path, "rb") as f:
                result = client.audio.transcriptions.create(
                    model=TRANSCRIBE_MODEL,
                    file=f,
                    language="zh",  # 明確指定中文,提升辨識穩定度
                )

            end_time = datetime.now()
            process_time = (end_time - start_time).total_seconds() * 1000
            print(f"轉文字耗時: {process_time}ms, case_name={case_name}")

            # OpenAI SDK 回傳的是物件,轉成跟原本 result['text'] 相容的格式
            return {"text": result.text}

        finally:
            os.unlink(temp_path)

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(e)
            }
        )


@router.post("/summary")
async def summary(audioRequest: AudioTextRequest):
    audio_service = AudioToTextService(None)
    result = audio_service.generate_summary(audioRequest.audioTexts)
    return result


@router.post("/punctuate")
async def punctuate_text(request: AudioTextRequest):
    try:
        text = request.audioTexts
        if not text:
            return JSONResponse(status_code=400, content={"error": "文字內容不能為空"})
        audio_service = AudioToTextService(None)
        punctuated_text = audio_service.add_punctuation(text)
        return {"result": punctuated_text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


@router.get("/get_vector/{file_name}")
async def get_vector(file_name: str):
    vector_store = CustomFaissVectorStore()
    return vector_store.get_doc(file_name=file_name)


@router.delete("/delete_vector/{file_name}")
async def delete_doc(file_name: str):
    vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
    vector_store.delete_documents(file_name=file_name)
    return "刪除成功"


@router.post("/rebuild-vector/{file_name}")
async def rebuild(audio_text: AudioTextRequest, file_name: str):
    vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
    vector_store.delete_documents(file_name=file_name)

    split_doc = split_datas(
        documents=[Document(page_content=audio_text.audioTexts)],
        chunk_size=500, chunk_overlap=10, data_type='documents'
    )

    vector_store.add_documents(file_name=file_name, datas=split_doc)
    return "ok"