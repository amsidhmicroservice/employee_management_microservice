import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../get_employee_service/get_employee_lambda/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commons/layers/shared/python')))

import os
from unittest.mock import patch, MagicMock
from dao.get_employee_dao import GetEmployeeDAO
import pytest


@patch("dao.get_employee_dao.get_dynamodb_resource")
def test_get_employee_found(mock_get_resource):
    os.environ["TABLE_NAME"] = "test-table"

    mock_table = MagicMock()
    mock_table.get_item.return_value = {"Item": {"employee_id": "123"}}

    mock_dynamodb = MagicMock()
    mock_dynamodb.Table.return_value = mock_table
    mock_get_resource.return_value = mock_dynamodb

    dao = GetEmployeeDAO()
    result = dao.get_employee("123")

    assert result["employee_id"] == "123"


@patch("dao.get_employee_dao.get_dynamodb_resource")
def test_get_employee_not_found(mock_get_resource):
    os.environ["TABLE_NAME"] = "test-table"

    mock_table = MagicMock()
    mock_table.get_item.return_value = {}

    mock_dynamodb = MagicMock()
    mock_dynamodb.Table.return_value = mock_table
    mock_get_resource.return_value = mock_dynamodb

    dao = GetEmployeeDAO()
    with pytest.raises(ValueError) as exc:
        dao.get_employee("456")
    assert "Employee with ID 456 not found" in str(exc.value)
