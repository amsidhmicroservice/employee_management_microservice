# ======================= validation/request_validation.py =======================
from pydantic import BaseModel, Field, EmailStr, ValidationError
from shared.common.logger import logger

class EmployeeCreateSchema(BaseModel):
    employee_id: str = Field(...)
    full_name: str = Field(...)
    email: EmailStr = Field(...)
    job_title: str = Field(...)

def validate_employee_request(data: dict):
    try:
        EmployeeCreateSchema(**data)
    except ValidationError as e:
        logger.error("Validation failed: %s", e.json())
        raise ValueError("Invalid request body")


