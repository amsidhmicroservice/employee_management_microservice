import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../create_employee_service/create_employee_lambda/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commons/layers/shared/python')))

from unittest.mock import patch, MagicMock
from service import create_employee_service


@patch("service.create_employee_service.CreateEmployeeDAO")
def test_create_employee_calls_dao(mock_dao_class):
    mock_dao = MagicMock()
    mock_dao.insert_employee.return_value = {"employee_id": "123"}
    mock_dao_class.return_value = mock_dao

    service = create_employee_service.CreateEmployeeService()
    employee_data = {
        "employee_id": "123",
        "full_name": "John Doe",
        "email": "john@example.com",
        "job_title": "Engineer"
    }

    result = service.create_employee(employee_data)

    mock_dao.insert_employee.assert_called_once_with(employee_data)
    assert result["employee_id"] == "123"
