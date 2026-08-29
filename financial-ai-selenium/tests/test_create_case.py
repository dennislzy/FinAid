import time

import config
import pytest

from apis.api_delete_case import api_delete_case
from apis.api_search_case import api_search_case
from pages.case_overview_page import CaseOverviewPage
from utils.random_util import generate_random_string

CASE_NAME = generate_random_string(prefix="test")
@pytest.fixture
def setup_and_teardown_create_case(driver):
    yield

    case_list = api_search_case()['rows']

    case_id_list = [id['caseInfoId'] for id in case_list]

    api_delete_case(case_id_list)


def test_create_case(driver, setup_and_teardown_create_case):
    driver.get(config.BASE_FRONTED_URL + "/case_overview")

    case_overview_page = CaseOverviewPage(driver)

    add_case_page = case_overview_page.click_add_case()

    add_case_page.enter_case_name('test_case')
    add_case_page.enter_case_english_name("Test Case")
    add_case_page.enter_case_phone("0912345678")
    add_case_page.enter_case_home_phone("0223456789")
    add_case_page.enter_case_email("test_case@gmail.com")
    add_case_page.enter_case_identification("A123456789")
    add_case_page.enter_case_postcode("100")
    add_case_page.enter_case_address("台北市信義區測試路1號")
    add_case_page.enter_case_city("台北市")
    # add_case_page.enter_case_birth("2025-01-27")
    add_case_page.enter_case_emergency_contact("緊急聯絡人")
    add_case_page.enter_case_emergency_phone("0923456789")
    add_case_page.enter_case_emergency_relate("家人")
    add_case_page.enter_case_career("工程師")
    add_case_page.enter_case_info_register_time("約1~3個月")
    add_case_page.enter_case_info_indigenous_status('是')
    add_case_page.enter_case_info_disability_status('否')
    add_case_page.enter_case_gender('男')
    add_case_page.enter_case_info_welfare_proof('是')
    add_case_page.enter_case_info_live_status('租屋')


    success_alert = add_case_page.click_submit_button()

    assert  success_alert.is_success_alert_visible()




