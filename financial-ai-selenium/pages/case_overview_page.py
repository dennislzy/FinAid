from selenium.webdriver.common.alert import Alert

from components.common.alert_message import AlertMessage
from pages.add_case_page import CaseInfoPage
from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from  typing_extensions import  Literal
class CaseOverviewPage(BasePage):

    SEARCH_BAR = (By.ID, "search-bar")

    ADD_CASE_BUTTON = (By.ID, "add-case-button")

    DELETE_BUTTON = (By.ID,'delete-button')

    def enter_search_keyword(self, keyword):
        """Enter a search keyword into the search bar."""
        search_input = self.wait.until(EC.element_to_be_clickable(self.SEARCH_BAR))
        search_input.clear()
        search_input.send_keys(keyword)

    def click_add_case(self):
        """Click the '新增' button to add a new case."""
        self.wait.until(EC.element_to_be_clickable(self.ADD_CASE_BUTTON)).click()
        return  CaseInfoPage(self.driver)

    def click_first_row_basic_info(self,row_id,item:Literal['基本資料','每年收支','每月收支','投資類明細','保險','檔案管理']):
        """Click the '基本資料' button of the first case row."""
        datatable_row_id = (By.ID, f"data-table-row-{row_id}-{item}")

        self.wait.until(
            EC.element_to_be_clickable(datatable_row_id)
        ).click()

    def click_first_row_checkbox(self,row_id):

        datatable_row_checkbox = (By.ID, f"data-table-checkbox-{row_id}")

        self.wait.until(
            EC.element_to_be_clickable(datatable_row_checkbox)
        ).click()


    def click_delete_button(self):
        self.wait.until(
            EC.element_to_be_clickable(self.DELETE_BUTTON)
        ).click()

        return  AlertMessage(self.driver)



