import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../get_employee_service/get_employee_lambda/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commons/layers/shared/python')))

from unittest.mock import patch, MagicMock
from service import get_employee_service


@patch("service.get_employee_service.GetEmployeeDAO")
@patch("service.get_employee_service.Employee")
def test_get_employee_success(mock_employee_class, mock_dao_class):
    mock_dao = MagicMock()
    mock_dao.get_employee.return_value = {
        "employee_id": "123",
        "full_name": "John Doe"
    }
    mock_dao_class.return_value = mock_dao

    mock_employee = MagicMock()
    mock_employee.to_dict.return_value = {
        "employee_id": "123",
        "full_name": "John Doe"
    }
    mock_employee_class.from_dict.return_value = mock_employee

    service = get_employee_service.GetEmployeeService()
    result = service.get_employee("123")

    mock_dao.get_employee.assert_called_once_with("123")
    mock_employee_class.from_dict.assert_called_once()
    assert result["employee_id"] == "123"
