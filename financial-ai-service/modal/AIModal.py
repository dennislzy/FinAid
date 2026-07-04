from typing import Union
from pathlib import Path
from openai import OpenAI
from langchain_openai import ChatOpenAI
from config import OPEN_AI_KEY


class AIModal:

    def __init__(self, file_path: Union[str, None]=None):
        self.chatModal = ChatOpenAI(
            api_key=OPEN_AI_KEY,
            model="gpt-4o-mini",
            temperature=0,
            # max_tokens=5000,
        )
        self.client = OpenAI(
            api_key=OPEN_AI_KEY
        )

        if file_path is not None:
            try:
                # 使用 Path 處理文件路徑
                audio_path = Path(file_path)
                
                # 如果是 URL，需要先下載文件
                if file_path.startswith(('http://', 'https://')):
                    import requests
                    response = requests.get(file_path)
                    if response.status_code == 200:
                        # 創建臨時文件
                        temp_path = Path('temp_audio.mp3')
                        temp_path.write_bytes(response.content)
                        audio_path = temp_path
                    else:
                        raise ValueError(f"Failed to download file from {file_path}")

                with open(audio_path, "rb") as audio_file:
                    self.audioModel = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        temperature=0
                    )
                
                # 如果使用了臨時文件，清理它
                if 'temp_path' in locals():
                    temp_path.unlink(missing_ok=True)
                    
            except FileNotFoundError:
                raise ValueError(f"The file at path {file_path} does not exist.")
            except Exception as e:
                raise RuntimeError(f"An error occurred while processing the audio file: {str(e)}")
        else:
            self.audioModel = None