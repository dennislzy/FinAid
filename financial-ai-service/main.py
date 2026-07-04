import os
from datetime import datetime

from fastapi import FastAPI, UploadFile
from fastapi.params import File
from fastapi.responses import JSONResponse
# from  controller import audioAndSummaryController
# from controller import ChatController
# from controller import testController
from controller import AIController
app = FastAPI(title="簡單的 FastAPI 應用")
import typer
import uvicorn
# 基本的 GET 路由
@app.get("/")
async def root():
    return {"message": "歡迎使用 FastAPI"}


# app.include_router(audioAndSummaryController.router)
# app.include_router(ChatController.router)
# app.include_router(testController.router)
app.include_router(AIController.router)


application=typer.Typer()
@application.command()
def start():
   uvicorn.run("main:app", host="127.0.0.1", port=7000, reload=True,workers=1)
if __name__ == "__main__":
    start()