# get_employee_lambda/handler/get_employee_handler.py
from backend_ip_client.ip_resolver import get_host_ip_with_retry
from service.get_employee_service import GetEmployeeService
from shared.common.decorators import log_operation
from shared.model.response_model import build_success_response
from shared.validation.exception_handler import handle_exception


@log_operation
def lambda_handler(event, context):
    try:
        employee_id = event['pathParameters']['employee_id']
        service = GetEmployeeService()
        employee = service.get_employee(employee_id)

        return build_success_response(200, {"employee": employee, "host_ip": get_host_ip_with_retry()})
    except Exception as e:
        return handle_exception(e)