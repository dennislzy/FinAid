import requests
import config
import logging

logger = logging.getLogger(__name__)


def api_search_case(page=0, size=5, order="desc", sort_by="caseInfoCreateTime", query=""):
    """
    Search cases via API.

    Args:
        page (int): Page number for pagination.
        size (int): Number of cases per page.
        order (str): Sorting order, "asc" or "desc".
        sort_by (str): Field to sort by.
        query (str): Search query string.

    Returns:
        dict: API response if successful, None otherwise.
    """

    request_url = f"{config.BASE_BACKEND_URL}/{config.SOCIAL_WORKER_EMAIL}/case/search"
    payload = {
        "page": page,
        "size": size,
        "order": order,
        "sortBy": sort_by,
        "query": query
    }

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
