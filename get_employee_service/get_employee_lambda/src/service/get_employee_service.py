# get_employee_lambda/service/get_employee_service.py
from shared.common.decorators import log_operation
from dao.get_employee_dao import GetEmployeeDAO
from shared.model.employee_model import Employee


class GetEmployeeService:
    def __init__(self):
        self.dao = GetEmployeeDAO()

    @log_operation
    def get_employee(self, employee_id: str) -> dict:
        employee_data = self.dao.get_employee(employee_id)
        return Employee.from_dict(employee_data).to_dict()