from components.common.alert_message import AlertMessage
from components.create_month_dialog import CreateMonthDataDialog
from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
class MonthIncomeDataPage(BasePage):
    
    # Year and Month selectors
    YEAR_SELECT = (By.ID, 'year-select')
    MONTH_SELECT = (By.ID, 'month-select')
    
    # Tab selectors
    INCOME_TAB = (By.ID, '收入')
    EXPENSE_TAB = (By.ID, '支出')
    
    # Add button
    ADD_BUTTON = (By.ID, 'add-button')
    
    # Table elements
    SELECT_ALL_CHECKBOX = (By.ID, 'select-all')
    
    # Navigation
    BACK_TO_OVERVIEW_BUTTON = (By.ID, 'back-to-overview')

    DELETE_BUTTON = (By.ID, 'delete-btn')
    
    
    def select_year(self, year):
        self.wait.until(
            EC.element_to_be_clickable(self.YEAR_SELECT)
        ).click()
        
        self.wait.until(
            EC.element_to_be_clickable((By.ID,year))
        ).click()
        # Additional logic needed to select from dropdown
        
    def select_month(self, month):
        self.wait.until(
            EC.element_to_be_clickable(self.MONTH_SELECT)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,month))
        ).click()
        # Additional logic needed to select from dropdown
    
    def click_income_tab(self):
        self.wait.until(
            EC.element_to_be_clickable(self.INCOME_TAB)
        ).click()

    
    def click_checkbox(self, checkbox_id):
        checkbox = self.wait.until(
            lambda driver: driver.find_element(By.ID, f"checkbox-{checkbox_id}")
        )
        checkbox.click()
        
    def click_expense_tab(self):
        self.wait.until(
            EC.element_to_be_clickable(self.EXPENSE_TAB)
        ).click()
    
    def click_add_button(self):
        self.wait.until(
            EC.element_to_be_clickable(self.ADD_BUTTON)
        ).click()
        return CreateMonthDataDialog(self.driver)
    
    def select_all_items(self):
        self.wait.until(
            EC.element_to_be_clickable(self.SELECT_ALL_CHECKBOX)
        ).click()
    
    def click_back_to_overview(self):
        self.wait.until(
            EC.element_to_be_clickable(self.BACK_TO_OVERVIEW_BUTTON)
        ).click()

    def is_data_visible(self, data_id):
        try:
            self.wait.until(
                EC.presence_of_element_located((By.ID, f"table-row-{data_id}"))
            )
            return True
        except TimeoutException:
            return False
    
    def click_delete_button(self):
        self.wait.until(
            EC.element_to_be_clickable(self.DELETE_BUTTON)
        ).click()

        return AlertMessage(self.driver)