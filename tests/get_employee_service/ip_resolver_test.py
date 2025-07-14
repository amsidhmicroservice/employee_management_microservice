import sys
import os

sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '../../get_employee_service/get_employee_lambda/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commons/layers/shared/python')))

from unittest.mock import patch, MagicMock
import pytest
from backend_ip_client import ip_resolver
from tenacity import RetryError


@patch("backend_ip_client.ip_resolver.requests.get")
def test_get_host_ip_success(mock_get):
    mock_response = MagicMock()
    mock_response.json.return_value = {"ip": "123.123.123.123"}
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    ip = ip_resolver.get_host_ip_with_retry()
    assert ip == "123.123.123.123"


@patch("backend_ip_client.ip_resolver.requests.get")
def test_get_host_ip_failure(mock_get):
    mock_get.side_effect = Exception("Connection failed")

    with pytest.raises(RetryError) as exc_info:
        ip_resolver.get_host_ip_with_retry()
    # get the original exception from the RetryError
    original_exception = exc_info.value.last_attempt.exception()
    assert "Connection failed" in str(original_exception)
