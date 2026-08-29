import time

from apis.api_create_case import api_create_case
import config
import pytest

from apis.api_delete_case import api_delete_case
from apis.api_search_case import api_search_case
from pages.case_overview_page import CaseOverviewPage
from utils.random_util import generate_random_string

CASE_NAME = generate_random_string(prefix="test")
@pytest.fixture
def setup_and_teardown_search_case(driver):
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
    api_create_case(payload)
    yield

    case_list = api_search_case()['rows']

    case_id_list = [id['caseInfoId'] for id in case_list]

    api_delete_case(case_id_list)


def test_search_case(driver, setup_and_teardown_search_case):
    driver.get(config.BASE_FRONTED_URL + "/case_overview")

    case_overview_page = CaseOverviewPage(driver)

    case_overview_page.enter_search_keyword(CASE_NAME)

    time.sleep(3)




