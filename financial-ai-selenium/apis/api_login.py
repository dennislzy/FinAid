
import  requests
import  config
import logging
logger = logging.getLogger(__name__)
def api_login():
    request_url = f"{config.BASE_BACKEND_URL}/login"

    response = requests.post(
        url=request_url,
        json={
          "socialWorkerEmail": "test5@gmail.com",
          "socialWorkerPassword": "555"
        },
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
