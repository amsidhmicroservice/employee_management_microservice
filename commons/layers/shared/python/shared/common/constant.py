# shared/common/constant.py
class ErrorCodes:
    VALIDATION_ERROR = "EMP-4000"
    UNKNOWN_ERROR = "EMP-5000"
    EMPLOYEE_NOT_FOUND = "EMP-4040"
    EMPLOYEE_ALREADY_EXISTS = "EMP-4090"
    UPDATE_CONFLICT = "EMP-4091"
    DELETE_FAILED = "EMP-4092"
    DATABASE_ERROR = "EMP-5001"

class HttpStatus:
    OK = 200
    CREATED = 201
    NO_CONTENT = 204
    BAD_REQUEST = 400
    NOT_FOUND = 404
    CONFLICT = 409
    INTERNAL_ERROR = 500

# Export as dict for backward compatibility
ERROR_CODES = {k: v for k, v in ErrorCodes.__dict__.items() if not k.startswith('_')}
