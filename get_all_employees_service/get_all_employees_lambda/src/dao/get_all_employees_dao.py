import os
from shared.common.decorators import log_operation
from shared.config.database_config import get_dynamodb_resource

class GetAllEmployeesDAO:
    def __init__(self):
        self.table_name = os.environ['TABLE_NAME']
        self.table = get_dynamodb_resource().Table(self.table_name)

    @log_operation
    def get_all_employees(self):
        response = self.table.scan()
        return response.get('Items', [])