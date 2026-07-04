import os

from langchain_openai import OpenAIEmbeddings

# 配置金鑰
OPEN_AI_KEY = os.getenv("OPEN_AI_KEY")

# 資料庫帳密與連線資訊,全部從環境變數讀取
db_user = os.getenv("DB_USERNAME", "root")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST", "db")      # 注意:預設值改成 service 名稱 db,而非 localhost
db_port = os.getenv("DB_PORT", "3306")
db_name = os.getenv("DB_NAME", "financial_springboot")

# 資料庫url
db_url = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}?charset=utf8mb4"

# 向量索引
OPEN_AI_EMBEDDING = OpenAIEmbeddings(
    api_key=OPEN_AI_KEY
)

os.environ['KMP_DUPLICATE_LIB_OK'] = "True"