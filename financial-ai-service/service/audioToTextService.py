from langchain_core.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.summarize import load_summarize_chain
from langchain_core.documents import Document
from VectorStore.FaissVectorStore import CustomFaissVectorStore, DataType
from modal.AIModal import AIModal
from prompts import combine_prompt, summary_prompt
from utils.splitterUtil import split_datas


class AudioToTextService(AIModal):
    vector_database = CustomFaissVectorStore(data_type=DataType.TEXT)

    def split_doc(self, orginal_doc: str):
        token_splitter = RecursiveCharacterTextSplitter(
            chunk_size=300,
            chunk_overlap=20
        )
        chunks = token_splitter.split_text(orginal_doc)
        doc_chunks = [Document(page_content=chunk) for chunk in chunks]
        return doc_chunks

    def generate_summary(self, orginal_doc):
        chunks_doc = self.split_doc(orginal_doc)
        summary = PromptTemplate.from_template(summary_prompt)
        combine = PromptTemplate.from_template(combine_prompt)

        chain = load_summarize_chain(
            llm=self.chatModal,
            chain_type="map_reduce",
            map_prompt=summary,
            combine_prompt=combine,
            verbose=True
        )

        result = chain.invoke(chunks_doc)
        return result["output_text"]

    def add_punctuation(self, text):
        # 定義 Prompt，要求 LLM 添加標點符號
        prompt_template = PromptTemplate.from_template(
            "請幫我將以下逐字稿內容轉換成具可讀性的完整對話，保持原始文字，適度加上標點與換行。角色名稱請加上社工與個案，不可刪減內容，也不可憑空新增內容。：\n\n{text}"
        )
        prompt = prompt_template.format(text=text)

        # 使用 chatModal 處理文字
        result = self.chatModal.invoke(prompt)
        return result.content  # 返回 LLM 生成的帶標點文字

    def add_texts_to_index(self, texts):
        split_texts = split_datas(texts)
        self.vector_database.add_documents(
            file_name="audio_text", datas=split_texts)

    def delete_texts(self, file_name: str):
        self.vector_database.delete_documents(file_name=file_name)
        return "刪除成功"
