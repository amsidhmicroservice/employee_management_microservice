# update_employee_lambda/handler/update_employee_handler.py
import json
from shared.common.decorators import log_operation
from add_employee_service.src.service import UpdateEmployeeService
from shared import handle_exception
from shared import validate_employee_update
from shared import build_success_response


@log_operation
def lambda_handler(event, context):
    try:
        employee_id = event['pathParameters']['employee_id']
        body = json.loads(event.get("body", "{}"))
        validate_employee_update(body)

        service = UpdateEmployeeService()
        updated_employee = service.update_employee(employee_id, body)

        return build_success_response(200, {"employee": updated_employee})
    except Exception as e:
        return handle_exception(e)