import config
from pages.register_page import RegisterPage
import pytest


@pytest.fixture
def setup_and_teardown_register(driver):
    yield


def test_register(driver, setup_and_teardown_register):
    driver.get(config.BASE_FRONTED_URL + "/register")

    register_page = RegisterPage(driver)

    register_page.enter_name("Test User")
    register_page.enter_email("test_register@gmail.com")
    register_page.enter_password("password123")

    success_alert = register_page.click_submit_button()

    assert success_alert.is_success_alert_visible()
