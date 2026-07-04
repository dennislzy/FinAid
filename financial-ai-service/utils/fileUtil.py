import requests
import os

from fastapi import HTTPException


def save_file(url:str):
    file_name = url.split("/")[len(url.split("/"))-1]
    print('file_name',file_name)
    response =  requests.get(url)
    if response.status_code == 200:
        with open(f"./upload_files/{file_name}", "wb") as f:
            f.write(response.content)
        return file_name
    else:
        print("上傳失敗")


def delete_file(url:str):
    file_name = url.split("/")[len(url.split("/"))-1]
    file_path = f"./upload_files/{file_name}"
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="檔案不存在")
    try:
        os.remove(file_path)
        return file_name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"刪除檔案時發生錯誤: {str(e)}")

