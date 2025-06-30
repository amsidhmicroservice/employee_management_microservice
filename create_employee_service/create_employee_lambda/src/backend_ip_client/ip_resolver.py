# ======================= backend_ip_client/ip_resolver.py =======================
import requests
from tenacity import retry, stop_after_attempt, wait_fixed
from shared.common.logger import logger


@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def get_host_ip_with_retry():
    """
    Get host IP with retry mechanism using public API
    """
    try:
        logger.info("Fetching host IP address")
        response = requests.get("https://api64.ipify.org?format=json", timeout=5)
        response.raise_for_status()
        ip = response.json().get("ip")
        if not ip:
            raise ValueError("No IP address returned from the API")
        logger.info("Host IP address resolved: %s", ip)
        return ip
    except Exception as e:
        logger.error("Failed to fetch IP address: %s", str(e))
        raise  # Let the central exception handler deal with it
