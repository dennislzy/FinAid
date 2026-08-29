
import  config
from pages.login_page import LoginPage
import  pytest

@pytest.fixture
def setup_and_teardown_login(driver):

    yield

def test_login(driver,setup_and_teardown_login):

    driver.get(config.BASE_FRONTED_URL+"/login")

    login_page = LoginPage(driver)

    login_page.enter_email('test5@gmail.com')

    login_page.enter_password('555')

    success_alert = login_page.click_submit_button()

    assert  success_alert.is_success_alert_visible()



