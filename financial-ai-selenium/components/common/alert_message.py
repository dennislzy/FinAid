from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class AlertMessage(BasePage):

    ALERT_SUCCESS = (By.ID,'alert-success')

    ALERT_ERROR = (By.ID,'alert-error')

    def is_success_alert_visible(self):

        success_alert = self.wait.until(
            EC.presence_of_element_located(self.ALERT_SUCCESS)
        )
        if success_alert:
            return  True
        else:
            return False
    def is_error_alert_visible(self):

        error_alert = self.wait.until(
            EC.presence_of_element_located(self.ALERT_ERROR)
        )
        if error_alert:
            return  True
        else:
            return False

