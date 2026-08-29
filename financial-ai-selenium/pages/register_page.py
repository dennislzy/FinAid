from components.common.alert_message import AlertMessage
from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class RegisterPage(BasePage):

    SOCIAL_WORKER_NAME = (By.ID, 'socialWorkerName')
    SOCIAL_WORKER_EMAIL = (By.ID, 'socialWorkerEmail')
    SOCIAL_WORKER_PASSWORD = (By.ID, 'socialWorkerPassword')
    BUTTON = (By.ID, 'register-button')

    def enter_name(self, name):
        self.wait.until(
            EC.element_to_be_clickable(self.SOCIAL_WORKER_NAME)
        ).send_keys(name)

    def enter_email(self, email):
        self.wait.until(
            EC.element_to_be_clickable(self.SOCIAL_WORKER_EMAIL)
        ).send_keys(email)

    def enter_password(self, password):
        self.wait.until(
            EC.element_to_be_clickable(self.SOCIAL_WORKER_PASSWORD)
        ).send_keys(password)

    def click_submit_button(self):
        self.wait.until(
            EC.element_to_be_clickable(self.BUTTON)
        ).click()

        return AlertMessage(self.driver)
