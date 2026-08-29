
import  requests
import  config
import logging
logger = logging.getLogger(__name__)
def api_delete_case(case_info_id_list):
    request_url = f"{config.BASE_BACKEND_URL}/{config.SOCIAL_WORKER_EMAIL}/case"

    response = requests.delete(
        url=request_url,
        json=case_info_id_list,
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
