# ======================= handler/create_employee_handler.py =======================
import json

from backend_ip_client.ip_resolver import get_host_ip_with_retry
from service.create_employee_service import CreateEmployeeService
from shared.common.logger import logger
from shared.model.response_model import build_success_response
from shared.validation.exception_handler import handle_exception
from shared.validation.request_validation import validate_employee_request


def lambda_handler(event, context):
    """
    AWS Lambda handler to create an employee in RDS
    """
    logger.info("Received event: %s", event)
    try:
        body = json.loads(event.get("body", "{}"))
        validate_employee_request(body)

        service = CreateEmployeeService()
        employee_data = service.create_employee(body)

        ip_address = get_host_ip_with_retry()
        response = build_success_response(
            201,
            {"employee": employee_data, "host_ip": ip_address}
        )
        logger.info("Successfully created employee")
        return response

    except Exception as e:
        logger.exception("Unhandled exception during create_employee")
        return handle_exception(e)
