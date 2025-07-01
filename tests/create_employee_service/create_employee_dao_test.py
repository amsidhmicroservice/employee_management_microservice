import os
import pytest
from unittest.mock import patch, MagicMock
from dao.create_employee_dao import CreateEmployeeDAO


@patch("dao.create_employee_dao.get_dynamodb_resource")
def test_insert_employee_success(mock_get_resource):
    os.environ["TABLE_NAME"] = "test-table"

    mock_table = MagicMock()
    mock_dynamodb = MagicMock()
    mock_dynamodb.Table.return_value = mock_table

    mock_get_resource.return_value = mock_dynamodb

    dao = CreateEmployeeDAO()

    employee = {
        "employee_id": "123",
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "job_title": "Engineer"
    }

    result = dao.insert_employee(employee)

    mock_table.put_item.assert_called_once_with(Item={
        "employee_id": "123",
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "job_title": "Engineer"
    })

    assert result == employee
