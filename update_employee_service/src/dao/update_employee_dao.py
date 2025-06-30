# update_employee_lambda/dao/update_employee_dao.py
import os

from shared.common.decorators import log_operation
from shared import get_dynamodb_resource


class UpdateEmployeeDAO:
    def __init__(self):
        self.table_name = os.environ["TABLE_NAME"]
        self.table = get_dynamodb_resource().Table(self.table_name)

    @log_operation
    def update_employee(self, employee: dict) -> dict:
        try:
            response = self.table.update_item(
                Key={'employee_id': employee['employee_id']},
                UpdateExpression="set full_name=:n, email=:e, job_title=:j",
                ExpressionAttributeValues={
                    ':n': employee['full_name'],
                    ':e': employee['email'],
                    ':j': employee['job_title']
                },
                ReturnValues="ALL_NEW"
            )
            return response['Attributes']
        except Exception as e:
            raise ValueError(f"Failed to update employee: {str(e)}")
