from service.get_all_employees_service import GetAllEmployeesService
from backend_ip_client.ip_resolver import get_host_ip_with_retry
from shared.common.decorators import log_operation
from shared.model.response_model import build_success_response
from shared.validation.exception_handler import handle_exception


@log_operation
def lambda_handler(event, context):
    try:
        service = GetAllEmployeesService()
        employees = service.get_all_employees()
        host_ip = get_host_ip_with_retry()
        return build_success_response(200, {"employees": employees, "host_ip": host_ip})
    except Exception as e:
        return handle_exception(e)
