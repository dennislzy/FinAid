from apis.api_get_month_data import api_get_month_data
from apis.api_create_case import api_create_case
from apis.api_delete_case import api_delete_case
import config

import pytest

from pages.month_overview_page import MonthIncomeDataPage
from utils.random_util import generate_random_string
CASE_NAME = generate_random_string(prefix="test")

@pytest.fixture
def setup_and_teardown_income_data(driver):
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


def test_add_income_data(driver, setup_and_teardown_income_data):

    case_id = setup_and_teardown_income_data
    # Navigate to the monthly income data page
    driver.get(config.BASE_FRONTED_URL + f"/month_overview/{case_id}/收入")

    month_overview_page = MonthIncomeDataPage(driver)

    month_overview_page.select_year(2023)

    month_overview_page.select_month(2)

    create_month_dialog = month_overview_page.click_add_button()

    create_month_dialog.enter_amount("1000")

    create_month_dialog.select_category("薪資")

    success_alert = create_month_dialog.click_submit_btn()

    month_data = api_get_month_data(case_id,'收入',2023,2)[0]['financialMonthlyRecordsId']

    assert success_alert.is_success_alert_visible()

    assert month_overview_page.is_data_visible(data_id=month_data)


