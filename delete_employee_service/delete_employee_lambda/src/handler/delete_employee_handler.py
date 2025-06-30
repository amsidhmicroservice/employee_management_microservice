# delete_employee_lambda/handler/delete_employee_handler.py
from shared.common.decorators import log_operation
from service.delete_employee_service import DeleteEmployeeService
from shared.validation.exception_handler import handle_exception
from shared.model.response_model import build_success_response


@log_operation
def lambda_handler(event, context):
    try:
        employee_id = event['pathParameters']['employee_id']

        service = DeleteEmployeeService()
        service.delete_employee(employee_id)

        return build_success_response(204, {})
    except Exception as e:
        return handle_exception(e)
