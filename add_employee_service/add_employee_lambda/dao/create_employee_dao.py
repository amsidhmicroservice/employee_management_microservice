

import os
from shared.config.database_config import get_dynamodb_resource
from shared.common.logger import logger

class CreateEmployeeDAO:
    def __init__(self):
        self.table_name = os.environ["TABLE_NAME"]
        self.dynamodb = get_dynamodb_resource()
        self.table = self.dynamodb.Table(self.table_name)

    def insert_employee(self, employee):
        logger.info("Putting item into DynamoDB table: %s", self.table_name)

        self.table.put_item(Item={
            "employee_id": employee["employee_id"],
            "full_name": employee["full_name"],
            "email": employee["email"],
            "job_title": employee["job_title"]
        })

        logger.info("Successfully inserted employee")
        return employee