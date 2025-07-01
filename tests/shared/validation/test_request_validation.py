import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../commons/layers/shared/python')))

from shared.validation import request_validation


def test_validate_employee_request_valid():
    valid_data = {
        "employee_id": "123",
        "full_name": "Jane Doe",
        "email": "jane.doe@example.com",
        "job_title": "Engineer"
    }

    # Should not raise exception
    result = request_validation.validate_employee_request(valid_data)
    assert result is None


def test_validate_employee_request_missing_fields():
    invalid_data = {}
    with pytest.raises(ValueError):
        request_validation.validate_employee_request(invalid_data)
