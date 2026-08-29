import time
from apis.api_create_month_data import api_create_month_data
from apis.api_create_case import api_create_case
from apis.api_delete_case import api_delete_case
import config

import pytest

from pages.month_overview_page import MonthIncomeDataPage
from utils.random_util import generate_random_string
CASE_NAME = generate_random_string(prefix="test")

@pytest.fixture
def setup_and_teardown_delete_income_data(driver):
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
    monthly1_payload = {
        "financialType": "收入",
        "monthly": 1,
        "financialCategory": "薪資",
        "year": 2024,
        "money": "567"
    }
    month1_data_id = api_create_month_data(case_id,monthly1_payload)['financialMonthlyRecordsId']
    monthly2_payload = {
        "financialType": "收入",
        "monthly": 1,
        "financialCategory": "其他收入",
        "year": 2024,
        "money": "567"
    }
    month2_data_id = api_create_month_data(case_id,monthly2_payload)['financialMonthlyRecordsId']
    yield case_id,month1_data_id,month2_data_id

    api_delete_case([case_id])


def test_delete_income_data(driver, setup_and_teardown_delete_income_data):

    case_id,month1_data_id,month2_data_id = setup_and_teardown_delete_income_data
    # Navigate to the monthly income data page
    driver.get(config.BASE_FRONTED_URL + f"/month_overview/{case_id}/收入")

    month_overview_page = MonthIncomeDataPage(driver)

    time.sleep(5)

    month_overview_page.click_checkbox(checkbox_id=month1_data_id)

    month_overview_page.click_checkbox(checkbox_id=month2_data_id)

    success_alert = month_overview_page.click_delete_button()

    assert success_alert.is_success_alert_visible()

    assert month_overview_page.is_data_visible(month1_data_id) == False

    assert month_overview_page.is_data_visible(month2_data_id) == False


