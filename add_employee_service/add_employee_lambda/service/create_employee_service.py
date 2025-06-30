# ======================= service/create_employee_service.py =======================
from dao.create_employee_dao import CreateEmployeeDAO
from shared.common.logger import logger


class CreateEmployeeService:
    """
    Service layer to handle create employee business logic
    """

    def __init__(self):
        self.dao = CreateEmployeeDAO()

    def create_employee(self, employee_data):
        logger.info("Calling DAO to insert employee data")
        return self.dao.insert_employee(employee_data)
