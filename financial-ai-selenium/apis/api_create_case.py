import requests
import config
import logging

logger = logging.getLogger(__name__)


def api_create_case(payload):
    """
    create cases via API.

    Args:
        page (int): Page number for pagination.
        size (int): Number of cases per page.
        order (str): Sorting order, "asc" or "desc".
        sort_by (str): Field to sort by.
        query (str): create query string.

    Returns:
        dict: API response if successful, None otherwise.
    """

    request_url = f"{config.BASE_BACKEND_URL}/{config.SOCIAL_WORKER_EMAIL}/case"

    response = requests.post(
        url=request_url,
        json=payload,
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
