from modal.AIModal import AIModal
from langchain_community.agent_toolkits import create_sql_agent, SQLDatabaseToolkit
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.vectorstores import FAISS
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_core.prompts import ChatPromptTemplate, FewShotPromptTemplate, MessagesPlaceholder, PromptTemplate, \
    SystemMessagePromptTemplate
from config import db_url, OPEN_AI_EMBEDDING
from modal.AIModal import AIModal
from service.chat.examples.data import examples, system_prefix
from langchain_community.utilities import SQLDatabase

class SQLService(AIModal):

    db = SQLDatabase.from_uri(db_url)

    def answer_by_sql(self,case_id:str,question_str:str):
        example_selector = SemanticSimilarityExampleSelector.from_examples(
                examples,
                OPEN_AI_EMBEDDING,
                FAISS,
                k=5,
                input_keys=["input"],
            )
        few_shot_prompt = FewShotPromptTemplate(
            example_selector=example_selector,
            example_prompt=PromptTemplate.from_template(
                "User input: {input}\nSQL query: {query}"
            ),
            input_variables=["input", "dialect", "top_k"],
            prefix=system_prefix,
            suffix="",
        )

        full_prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate(prompt=few_shot_prompt),
                ("human", "{input}"),
                MessagesPlaceholder("agent_scratchpad"),
            ]
        )

        executor = create_sql_agent(
            llm=self.chatModal,
            toolkit=SQLDatabaseToolkit(db=self.db, llm=self.chatModal),
            verbose=True,
            prompt=full_prompt,
            agent_type="openai-tools",
        )

        question = f"個案id為{case_id},{question_str}"

        result = executor.invoke(question)

        return result
