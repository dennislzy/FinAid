from typing import List, Union
from langchain_community.vectorstores import FAISS
from enum import Enum
from langchain_core.documents import Document
from config import OPEN_AI_EMBEDDING
import os


class DataType(Enum):
    TEXT = 'text'
    DOCUMENT = 'document'


class CustomFaissVectorStore:
    def __init__(self, folder_path='faiss_db', collection_name='index', data_type: DataType = DataType.TEXT):
        """初始化 FAISS 向量库
        Args:
            folder_path (str): 向量库存储路径
            collection_name (str): 集合名称
        """
        self.folder_path = folder_path
        self.collection_name = collection_name
        self.data_type = data_type
        self.index_path = os.path.join(folder_path, f"{collection_name}.faiss")
        self.store_path = os.path.join(folder_path, f"{collection_name}.pkl")

        # 创建存储目录
        os.makedirs(folder_path, exist_ok=True)

        # 初始化或加载现有的向量库
        self.db = self._load_db()

        # 如果加载失败，初始化新的向量库
        if self.db is None:
            self._initialize_empty_db()

    def _load_db(self):
        """加载现有的向量库"""
        if not self.exists():
            return None

        try:
            return FAISS.load_local(
                self.folder_path,
                OPEN_AI_EMBEDDING,
                self.collection_name,
                allow_dangerous_deserialization=True  # 添加安全反序列化参数
            )
        except Exception as e:
            print(f"加载向量库时发生错误: {e}")
            return None

    def _initialize_empty_db(self):
        """初始化空的向量库"""
        try:
            self.db = FAISS.from_texts(
                texts=["初始化文档"],  # 添加初始文档
                embedding=OPEN_AI_EMBEDDING,
                metadatas=[{"initialization": True}]
            )
            self.db.save_local(self.folder_path, self.collection_name)
        except Exception as e:
            print(f"初始化向量库时发生错误: {e}")
            raise ValueError("无法初始化向量库")

    def exists(self):
        """检查向量库是否存在"""
        return os.path.exists(self.index_path) and os.path.exists(self.store_path)

    def save_documents(self, data: Union[List[str], List[Document]], metadatas=None):
        """保存文档到向量数据库"""
        if self.data_type == DataType.TEXT:
            self.db = FAISS.from_texts(
                texts=data,
                embedding=OPEN_AI_EMBEDDING,
                metadatas=metadatas
            )
        else:
            self.db = FAISS.from_documents(
                documents=data,
                embedding=OPEN_AI_EMBEDDING
            )
        # 保存到本地
        self.db.save_local(self.folder_path, self.collection_name)
    
    def search(self, query: str, k: int = 2,filter=None):
        """使用MMR搜索相似文档
        
        Args:
            query: 查詢文本
            filter: 過濾條件
            k: 返回的文檔數量
            lambda_mult: 多樣性參數，0-1之間，越接近1越注重相似度，越接近0越注重多樣性
        """
        return self.db.similarity_search(
            query=query,
            k=k,
            filter=filter,
        )
        
    def max_search(self,query:str):
        return self.db.max_marginal_relevance_search(
            query=query,
            fetch_k=4,
            k=3
        )

    def add_documents(self, file_name: str, datas: Union[List[str], List[Document]], metadatas: List[dict] = None):
        """添加新文档到现有索引"""
        if self.data_type == DataType.TEXT:
            # 为每个文本添加文件名到 metadata
            if metadatas is None:
                metadatas = [{} for _ in datas]
            for i, metadata in enumerate(metadatas):
                metadata['file_name'] = file_name
                metadata['doc_id'] = f"{file_name}-{i}"
            self.db.add_texts(texts=datas, metadatas=metadatas)
        else:
            # 为每个 Document 添加文件名到 metadata
            for i, doc in enumerate(datas):
                if not doc.metadata:
                    doc.metadata = {}
                doc.metadata['file_name'] = file_name
                doc.metadata['doc_id'] = f"{file_name}-{i}"
            self.db.add_documents(documents=datas)

        # 保存更新后的向量库
        self.db.save_local(self.folder_path, self.collection_name)

    def delete_index(self):
        """删除整个向量库"""
        try:
            if os.path.exists(self.index_path):
                os.remove(self.index_path)
            if os.path.exists(self.store_path):
                os.remove(self.store_path)
            self.db = None
            print(f"向量库 {self.collection_name} 已被删除")
        except Exception as e:
            print(f"删除向量库时发生错误: {e}")

    def create_retriever(self, search_type="similarity", **kwargs):
        """创建检索器用于 RAG"""
        return self.db.as_retriever(
            search_type=search_type,
            **kwargs
        )

    def delete_documents(self, file_name: str) -> bool:
        """删除指定文件名的所有文档并重建索引

        Args:
            file_name: 要删除的文件名

        Returns:
            bool: 删除成功返回 True，失败返回 False
        """
        try:
            # 1. 获取要删除的文档
            docs_to_delete = self.get_doc(file_name=file_name)
            print(docs_to_delete)
            if not docs_to_delete:
                print(f"No documents found with file_name: {file_name}")
                return False

            # 2. 获取要保留的文档
            all_docs = self.get_doc()
            docs_to_keep = [
                doc for doc in all_docs
                if doc.metadata.get("file_name") != file_name
            ]

            # 3. 删除指定文档
            delete_ids = [doc.id for doc in docs_to_delete]
            self.db.delete(ids=delete_ids)

            # 4. 重建索引
            if len(docs_to_keep) > 0:  # 如果还有剩余文档
                if self.data_type == DataType.TEXT:
                    # 使用 texts 方式重建
                    texts = [doc.page_content for doc in docs_to_keep]
                    metadatas = [doc.metadata for doc in docs_to_keep]
                    self.db = FAISS.from_texts(
                        texts=texts,
                        embedding=OPEN_AI_EMBEDDING,
                        metadatas=metadatas
                    )
                else:
                    # 使用 documents 方式重建
                    self.db = FAISS.from_documents(
                        documents=docs_to_keep,
                        embedding=OPEN_AI_EMBEDDING
                    )

                # 保存更新后的向量库
                self.db.save_local(self.folder_path, self.collection_name)
            else:
                # 如果没有剩余文档,重新初始化空的向量库
                self._initialize_empty_db()
            return True

        except Exception as e:
            print(f"Error deleting documents: {str(e)}")
            raise

    def get_doc(self,file_name:Union[str,None]=None)->List[Document]:
        """根據metadata 獲取文檔"""
        if not self.db:
            return []

        all_doc_id = list(self.db.index_to_docstore_id.values())
        all_doc = self.db.get_by_ids(all_doc_id)
        # print("all",all_doc)
        if file_name is None:
            return all_doc
        else:
            return [
                doc for doc in all_doc
                if doc.metadata.get("file_name") == file_name
            ]
    
    def get_doc_by_id(self,all_doc_id:str)->List[Document]:
        """根據metadata 獲取文檔"""
        if not self.db:
            return []
        all_doc = self.db.get_by_ids(all_doc_id)

        return all_doc