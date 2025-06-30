from typing import Dict, Optional
from shared.model.employee_model import Employee


def validate_employee_update(updates: Dict) -> None:
    """
    Validates employee update data.

    Args:
        updates (Dict): Dictionary containing the fields to update

    Raises:
        ValueError: If validation fails
    """
    # Check if there are any fields to update
    if not updates:
        raise ValueError("No update fields provided")

    # Check for invalid fields
    valid_fields = set(Employee.__annotations__.keys())
    invalid_fields = set(updates.keys()) - valid_fields
    if invalid_fields:
        raise ValueError(f"Invalid fields in update: {', '.join(invalid_fields)}")

    # Ensure employee_id cannot be updated
    if 'employee_id' in updates:
        raise ValueError("employee_id cannot be updated")

    # Validate types for provided fields
    for field, value in updates.items():
        expected_type = Employee.__annotations__[field]
        # Handle Optional types
        if hasattr(expected_type, "__origin__") and expected_type.__origin__ is Optional:
            expected_type = expected_type.__args__[0]

        if value is not None and not isinstance(value, expected_type):
            raise ValueError(
                f"Invalid type for field '{field}'. Expected {expected_type.__name__}, got {type(value).__name__}")