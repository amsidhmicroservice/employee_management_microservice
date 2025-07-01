import json
import pytest

from unittest.mock import patch, MagicMock

# adjust path as needed
from handler import create_employee_handler


@pytest.fixture
def sample_event():
    return {
        "body": json.dumps({
            "employee_id": "123",
            "full_name": "John Doe",
            "email": "john.doe@example.com",
            "job_title": "Engineer"
        })
    }


@patch("handler.create_employee_handler.get_host_ip_with_retry")
@patch("handler.create_employee_handler.CreateEmployeeService")
@patch("handler.create_employee_handler.validate_employee_request")
@patch("handler.create_employee_handler.build_success_response")
def test_lambda_handler_success(
    mock_build_success_response,
    mock_validate,
    mock_service_class,
    mock_get_ip,
    sample_event,
):
    mock_service = MagicMock()
    mock_service.create_employee.return_value = {
        "employee_id": "123",
        "full_name": "John Doe"
    }
    mock_service_class.return_value = mock_service

    mock_get_ip.return_value = "192.168.1.1"

    mock_build_success_response.return_value = {
        "statusCode": 201,
        "body": json.dumps({"message": "success"})
    }

    result = create_employee_handler.lambda_handler(sample_event, None)

    mock_validate.assert_called_once()
    mock_service.create_employee.assert_called_once()
    mock_get_ip.assert_called_once()
    mock_build_success_response.assert_called_once()

    assert result["statusCode"] == 201


@patch("handler.create_employee_handler.handle_exception")
@patch("handler.create_employee_handler.validate_employee_request")
def test_lambda_handler_failure(
    mock_validate,
    mock_handle_exception,
    sample_event,
):
    mock_validate.side_effect = ValueError("Invalid data")
    mock_handle_exception.return_value = {"statusCode": 400, "body": "error"}

    result = create_employee_handler.lambda_handler(sample_event, None)

    mock_handle_exception.assert_called_once()
    assert result["statusCode"] == 400
