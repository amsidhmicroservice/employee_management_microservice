from unittest.mock import patch, MagicMock
from service.create_employee_service import CreateEmployeeService


@patch("service.create_employee_service.CreateEmployeeDAO")
def test_create_employee_calls_dao(mock_dao_class):
    mock_dao_instance = MagicMock()
    mock_dao_class.return_value = mock_dao_instance

    service = CreateEmployeeService()

    employee_data = {
        "employee_id": "123",
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "job_title": "Engineer"
    }

    service.create_employee(employee_data)

    mock_dao_instance.insert_employee.assert_called_once_with(employee_data)
