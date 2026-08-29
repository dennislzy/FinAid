
import  requests
import  config
import logging
logger = logging.getLogger(__name__)
def api_get_month_data(caseInfoId,financialType,year,month):
    request_url = f"{config.BASE_BACKEND_URL}/{config.SOCIAL_WORKER_EMAIL}/case/{caseInfoId}/household_monthly_financial_records?financialType={financialType}&year={year}&monthly={month}"

    response = requests.get(
        url=request_url,
        timeout=config.TIMEOUT
    )
    if response.status_code == 200:
        return response.json()
    else:
        logger.error(
            "Failed to create article via API. Status code: %s, Message: %s",
            response.status_code,
            response.text,
        )
        return None
