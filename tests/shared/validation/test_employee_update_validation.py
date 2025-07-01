import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../commons/layers/shared/python')))

from shared.validation import employee_update_validation


def test_validate_employee_update_valid():
    valid_data = {
        "full_name": "Jane Doe"
    }
    result = employee_update_validation.validate_employee_update(valid_data)
    # The function returns None if validation passes
    assert result is None


def test_validate_employee_update_invalid():
    invalid_data = {}
    with pytest.raises(ValueError):
        employee_update_validation.validate_employee_update(invalid_data)
