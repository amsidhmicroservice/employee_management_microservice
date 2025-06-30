# shared/model/employee_model.py
from dataclasses import dataclass
from typing import Optional


@dataclass
class Employee:
    employee_id: str
    full_name: str
    email: str
    job_title: str
    department: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict):
        return cls(**{
            k: v for k, v in data.items()
            if k in cls.__annotations__
        })

    def to_dict(self):
        return {
            k: v for k, v in self.__dict__.items()
            if v is not None
        }