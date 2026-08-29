import time
import urllib
from apis.api_get_month_data import api_get_month_data
from apis.api_create_case import api_create_case
from apis.api_delete_case import api_delete_case
import config

import pytest

from pages.month_overview_page import MonthIncomeDataPage
from utils.random_util import generate_random_string
CASE_NAME = generate_random_string(prefix="test")

@pytest.fixture
def setup_and_teardown_switch_to_expense_tab(driver):
    payload ={
        "caseInfoName": CASE_NAME,
        "caseInfoEnglishName": "",
        "caseInfoPhone": "",
        "caseInfoHomePhone": "",
        "caseInfoEmail": "",
        "caseInfoIdentification": "身份證號未提供",
        "caseInfoPostCode": "",
        "caseInfoAddress": "",
        "caseInfoCity": "",
        "caseInfoEmergencyContact": "",
        "caseInfoEmergencyPhone": "",
        "caseInfoEmergencyRelate": "",
        "caseInfoCareer": "",
        "caseInfoLiveStatus":"租屋",
        "caseInfoGender":"女",
        "caseInfoHouseholdRegisterTime":"約1~3個月",
        "isIndigenousOrNewResident":'是',
        "isDisability":'否',
        "isWelfareIdentityProof":'是'
    }
    case_response = api_create_case(payload)
    case_id = case_response['caseInfoId']
    yield case_id

    api_delete_case([case_id])


def test_switch_to_expense_tab(driver, setup_and_teardown_switch_to_expense_tab):

    case_id = setup_and_teardown_switch_to_expense_tab
    # Navigate to the monthly income data page
    driver.get(config.BASE_FRONTED_URL + f"/month_overview/{case_id}/收入")

    month_overview_page = MonthIncomeDataPage(driver)

    month_overview_page.click_expense_tab()

    time.sleep(3)

    current_url = driver.current_url

    expected_url = config.BASE_FRONTED_URL + f"/month_overview/{case_id}/支出"

    expected_url_encoded = urllib.parse.quote(expected_url, safe=':/')

    assert current_url == expected_url_encoded

    





