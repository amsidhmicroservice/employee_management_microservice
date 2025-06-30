# update_employee_lambda/service/update_employee_service.py
from shared.common.decorators import log_operation
from dao.update_employee_dao import UpdateEmployeeDAO
from shared.model.employee_model import Employee


class UpdateEmployeeService:
    def __init__(self):
        self.dao = UpdateEmployeeDAO()

    @log_operation
    def update_employee(self, employee_id: str, updates: dict) -> dict:
        # First check if employee exists
        existing = self.dao.get_employee(employee_id)

        # Merge existing data with updates
        updated_data = {**existing, **updates}
        employee = Employee.from_dict(updated_data)

        return self.dao.update_employee(employee.to_dict())