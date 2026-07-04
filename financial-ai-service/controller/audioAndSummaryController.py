import os
from fastapi import FastAPI
import whisper
import multiprocessing
from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
import whisper
import tempfile
from datetime import datetime
from service.audioToTextService import AudioToTextService
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
from fastapi.responses import JSONResponse
from langchain_core.documents import Document

from utils.splitterUtil import split_datas
router = APIRouter(prefix="/api/ai", tags=['audio'])


class AudioTextRequest(BaseModel):
    audioTexts: str


class FileRequest(BaseModel):
    file_path: str


class SummaryRequest(BaseModel):
    summaryTexts: str
    fileName: str


WHISPER_MODEL_DIR = '/app/whisper_models'
os.makedirs(WHISPER_MODEL_DIR, exist_ok=True)


# 修改 Whisper 的下载根目录
whisper.utils.download_root = WHISPER_MODEL_DIR

app = FastAPI()

# 使用多进程锁来确保只加载一次
model_lock = multiprocessing.Lock()
MODEL = None


def get_model():
    global MODEL
    if MODEL is None:
        with model_lock:
            if MODEL is None:  # 双重检查锁定
                print("正在加载 Whisper 模型...")
                MODEL = whisper.load_model(
                    "small", download_root=WHISPER_MODEL_DIR)
                print("Whisper 模型加载完成")
    return MODEL


# 在主进程启动时加载模型
MODEL = get_model()


@router.post("/audio/{case_name}")
async def audioToText(audio_file: UploadFile = File(...), case_name: str = None):
    vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)
    audio_service = AudioToTextService(None)
    try:
        start_time = datetime.now()
        model = get_model()  # 获取已加载的模型

        # 检查文件类型
        if not audio_file.content_type.startswith('audio/'):
            return JSONResponse(
                status_code=400,
                content={"error": "请上传音频文件"}
            )

        # 创建临时文件来存储上传的音频
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as temp_file:
            content = await audio_file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        try:
            result = model.transcribe(temp_path)
            end_time = datetime.now()
            process_time = (end_time - start_time) * 1000
            # punctuated_text = audio_service.add_punctuation(result['text'])
            # split_doc = split_datas(documents=[Document(
            #     page_content=punctuated_text)], chunk_size=500, chunk_overlap=10, data_type='documents')
            # vector_store.add_documents(file_name=case_name, datas=split_doc)
            return result

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

# 新增 /punctuate 端點


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
async def rebuild(audio_text:AudioTextRequest,file_name:str):

    vector_store = CustomFaissVectorStore(data_type=DataType.DOCUMENT)

    vector_store.delete_documents(file_name=file_name)

    split_doc = split_datas(documents=[Document(
        page_content=audio_text.audioTexts)], chunk_size=500, chunk_overlap=10, data_type='documents'
    )

    vector_store.add_documents(file_name=file_name,datas=split_doc)

    return "ok"
    
