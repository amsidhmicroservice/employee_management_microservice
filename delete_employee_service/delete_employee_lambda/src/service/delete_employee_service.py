# delete_employee_lambda/service/delete_employee_service.py
from shared.common.decorators import log_operation
from dao.delete_employee_dao import DeleteEmployeeDAO


class DeleteEmployeeService:
    def __init__(self):
        self.dao = DeleteEmployeeDAO()

    @log_operation
    def delete_employee(self, employee_id: str):
        # First verify employee exists
        self.dao.get_employee(employee_id)
        # Then delete
        self.dao.delete_employee(employee_id)