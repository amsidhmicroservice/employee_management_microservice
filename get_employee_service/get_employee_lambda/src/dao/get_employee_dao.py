# get_employee_lambda/dao/get_employee_dao.py
import os

from shared.common.decorators import log_operation
from shared.config.database_config import get_dynamodb_resource

class GetEmployeeDAO:
    def __init__(self):
        self.table_name = os.environ["TABLE_NAME"]
        self.table = get_dynamodb_resource().Table(self.table_name)

    @log_operation
    def get_employee(self, employee_id: str) -> dict:
        response = self.table.get_item(
            Key={'employee_id': employee_id}
        )

        if 'Item' not in response:
            raise ValueError(f"Employee with ID {employee_id} not found")

        return response['Item']