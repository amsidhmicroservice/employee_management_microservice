# ======================= model/error_model.py =======================
from dataclasses import dataclass

@dataclass
class ErrorModel:
    status: int
    message: str
    error_code: str
    trace_id: str