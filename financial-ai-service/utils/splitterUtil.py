from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Union, List
from langchain_core.documents import Document

def split_datas(
    documents: Union[str, List[Document]], 
    chunk_size: int = 500, 
    chunk_overlap: int = 50,
    data_type: str = 'text'
) -> Union[List[str], List[Document]]:
    """
    將文本或文檔切分成較小的片段。
    
    使用 RecursiveCharacterTextSplitter 將輸入的文本或文檔進行分割，
    可以處理純文本字符串或 Langchain Document 對象。
    
    Args:
        documents (Union[str, List[Document]]): 要切分的文本或文檔。
            如果 data_type='text'，則應該是字符串；
            如果 data_type='document'，則應該是 Document 對象列表
        chunk_size (int, optional): 每個切分片段的最大字符數。默認為 500
        chunk_overlap (int, optional): 相鄰片段之間的重疊字符數。默認為 50
        data_type (str, optional): 輸入數據的類型，可選值為 'text' 或其他。
            - 'text': 輸入為純文本字符串
            - 其他: 輸入為 Document 對象列表
    
    Returns:
        Union[List[str], List[Document]]: 
            - 如果 data_type='text'，返回切分後的文本片段列表
            - 否則返回切分後的 Document 對象列表
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    if data_type == 'text':
        split_text = text_splitter.split_text(documents)
        return split_text
    else:
        split_documents = text_splitter.split_documents(documents)
        return split_documents