# update_employee_lambda/handler/update_employee_handler.py
import json
from backend_ip_client.ip_resolver import get_host_ip_with_retry
from shared.common.decorators import log_operation
from service.update_employee_service import UpdateEmployeeService
from shared.validation.exception_handler import handle_exception
from shared.validation.employee_update_validation import validate_employee_update
from shared.model.response_model import build_success_response


@log_operation
def lambda_handler(event, context):
    try:
        employee_id = event['pathParameters']['employee_id']
        body = json.loads(event.get("body", "{}"))
        validate_employee_update(body)

        service = UpdateEmployeeService()
        updated_employee = service.update_employee(employee_id, body)

        return build_success_response(200, {"employee": updated_employee,"host_ip": get_host_ip_with_retry()})
    except Exception as e:
        return handle_exception(e)