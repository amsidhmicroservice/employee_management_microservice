# delete_employee_lambda/dao/delete_employee_dao.py
import os

from shared.common.decorators import log_operation
from shared.config.database_config import get_dynamodb_resource


class DeleteEmployeeDAO:
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

    @log_operation
    def delete_employee(self, employee_id: str):
        try:
            self.table.delete_item(
                Key={'employee_id': employee_id}
            )
        except Exception as e:
            raise ValueError(f"Failed to delete employee: {str(e)}")
