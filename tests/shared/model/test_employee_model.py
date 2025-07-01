import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../commons/layers/shared/python')))

from shared.model.employee_model import Employee


def test_employee_to_dict():
    data = {
        "employee_id": "123",
        "full_name": "John Doe",
        "email": "john@example.com",
        "job_title": "Engineer"
    }

    employee = Employee.from_dict(data)
    result = employee.to_dict()

    assert result["employee_id"] == "123"
    assert result["full_name"] == "John Doe"
    assert result["email"] == "john@example.com"
    assert result["job_title"] == "Engineer"
