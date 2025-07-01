import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../get_employee_service/get_employee_lambda/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commons/layers/shared/python')))

import pytest
from unittest.mock import patch, MagicMock
from handler import get_employee_handler


@patch("handler.get_employee_handler.get_host_ip_with_retry")
@patch("handler.get_employee_handler.build_success_response")
@patch("handler.get_employee_handler.GetEmployeeService")
def test_lambda_handler_success(mock_service_class, mock_build_success, mock_get_ip):
    mock_service = MagicMock()
    mock_service.get_employee.return_value = {"employee_id": "123"}
    mock_service_class.return_value = mock_service
    mock_get_ip.return_value = "192.168.1.1"
    mock_build_success.return_value = {"statusCode": 200}

    event = {"pathParameters": {"employee_id": "123"}}
    result = get_employee_handler.lambda_handler(event, None)

    assert result["statusCode"] == 200


@patch("handler.get_employee_handler.handle_exception")
@patch("handler.get_employee_handler.GetEmployeeService")
def test_lambda_handler_error(mock_service_class, mock_handle_exception):
    mock_service = MagicMock()
    mock_service.get_employee.side_effect = Exception("Some error")
    mock_service_class.return_value = mock_service
    mock_handle_exception.return_value = {"statusCode": 500}

    event = {"pathParameters": {"employee_id": "123"}}
    result = get_employee_handler.lambda_handler(event, None)

    assert result["statusCode"] == 500
