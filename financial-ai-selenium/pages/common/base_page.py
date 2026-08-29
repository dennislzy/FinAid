from selenium.webdriver.support.ui import WebDriverWait
import config
class BasePage:
    def __init__(self, driver):
        """
        Initializes the BasePage with the provided WebDriver instance.

        Args:
            driver (WebDriver): The WebDriver instance to control the browser.
        """
        self.driver = driver
        self.wait = WebDriverWait(self.driver, config.TIMEOUT)