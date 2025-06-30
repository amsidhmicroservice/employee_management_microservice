# ======================= validation/exception_handler.py =======================
import json
import uuid
from shared.model.error_model import ErrorModel
from shared.common.logger import logger
from shared.common.constant import ERROR_CODES

def handle_exception(exception):
    trace_id = str(uuid.uuid4())
    logger.error("Exception Trace [%s]: %s", trace_id, str(exception))

    if isinstance(exception, ValueError):
        error = ErrorModel(
            status=400,
            message=str(exception),
            error_code=ERROR_CODES["VALIDATION_ERROR"],
            trace_id=trace_id
        )
    else:
        error = ErrorModel(
            status=500,
            message="Internal Server Error",
            error_code=ERROR_CODES["UNKNOWN_ERROR"],
            trace_id=trace_id
        )

    return {
        "statusCode": error.status,
        "body": json.dumps(error.__dict__)
    }
