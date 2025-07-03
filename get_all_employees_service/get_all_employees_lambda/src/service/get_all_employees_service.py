from dao.get_all_employees_dao import GetAllEmployeesDAO
from shared.model.employee_model import Employee

class GetAllEmployeesService:
    def __init__(self):
        self.dao = GetAllEmployeesDAO()

    def get_all_employees(self):
        employees_data = self.dao.get_all_employees()
        return [Employee.from_dict(emp).to_dict() for emp in employees_data]