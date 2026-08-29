from components.common.alert_message import AlertMessage
from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException
class CreateMonthDataDialog(BasePage):
    
    # Form field selectors
    FINANCIAL_CATEGORY = (By.ID, 'financialCategory')
    MONEY_INPUT = (By.ID, 'money')
    
    # Button selectors
    CANCEL_BUTTON = (By.ID, 'cancel-btn')
    SUBMIT_BUTTON = (By.ID, 'submit-btn')
    
    def select_category(self, category):
        self.wait.until(
            EC.element_to_be_clickable(self.FINANCIAL_CATEGORY)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,category))
        ).click()
        # Additional logic needed to select the specific category from dropdown
        
    def enter_amount(self, amount):
        money_field = self.wait.until(
            EC.element_to_be_clickable(self.MONEY_INPUT)
        )
        money_field.clear()
        money_field.send_keys(amount)
    
    def click_cancel_btn(self):
        self.wait.until(
            EC.element_to_be_clickable(self.CANCEL_BUTTON)
        ).click()
        # Return to previous page or handle dialog closure
    
    def click_submit_btn(self):
        self.wait.until(
            EC.element_to_be_clickable(self.SUBMIT_BUTTON)
        ).click()
        return AlertMessage(self.driver)

    def get_financial_category(self):
        max_attempts = 3
        attempts = 0
        
        while attempts < max_attempts:
            try:
                # 等待元素存在並返回文本
                element = self.wait.until(
                    EC.presence_of_element_located(self.FINANCIAL_CATEGORY)
                )
                return element.text
            except StaleElementReferenceException:
                # 如果遇到陳舊元素引用錯誤，重試
                attempts += 1
                if attempts == max_attempts:
                    raise  # 重試次數用完，重新拋出異常
        
        return None  # 如果所有嘗試都失敗（通常不會到達這裡）