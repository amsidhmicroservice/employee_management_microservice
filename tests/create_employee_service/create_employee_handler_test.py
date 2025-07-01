import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../create_employee_service/create_employee_lambda/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commons/layers/shared/python')))

import pytest
from unittest.mock import patch, MagicMock
from handler import create_employee_handler


@patch("handler.create_employee_handler.get_host_ip_with_retry")
@patch("handler.create_employee_handler.CreateEmployeeService")
@patch("handler.create_employee_handler.validate_employee_request")
@patch("handler.create_employee_handler.build_success_response")
def test_lambda_handler_success(
    mock_build_success_response,
    mock_validate,
    mock_service_class,
    mock_get_ip,
):
    mock_service = MagicMock()
    mock_service.create_employee.return_value = {"employee_id": "123"}
    mock_service_class.return_value = mock_service
    mock_get_ip.return_value = "127.0.0.1"
    mock_build_success_response.return_value = {"statusCode": 201}

    event = {
        "body": '{"employee_id":"123", "full_name":"John Doe", "email":"john@example.com", "job_title":"Engineer"}'
    }
    result = create_employee_handler.lambda_handler(event, None)
    assert result["statusCode"] == 201


@patch("handler.create_employee_handler.handle_exception")
@patch("handler.create_employee_handler.validate_employee_request")
def test_lambda_handler_error(mock_validate, mock_handle_exception):
    mock_validate.side_effect = ValueError("Invalid request")
    mock_handle_exception.return_value = {"statusCode": 400}

    event = {"body": "{}"}
    result = create_employee_handler.lambda_handler(event, None)

    assert result["statusCode"] == 400
