# Employee Management System
## Project Structure
employee-management-system/
│
├── layers
│   ├── dependencies
│   │   └── python
│   │       └── (dependencies packages)
│   │
│   └── shared
│       └── python
│           └── shared
│               ├── common
│               │   └── logger.py
│               │
│               ├── model
│               │   ├── error_model.py
│               │   └── response_model.py
│               │
│               └── validation
│                   ├── request_validation.py
│                   └── exception_handler.py
│
├── add_employee_service
│   ├── add_employee_lambda
│   │   ├── backend_ip_client
│   │   │   └── ip_resolver.py
│   │   │
│   │   ├── handler
│   │   │   └── create_employee_handler.py
│   │   │
│   │   └── service
│   │       └── create_employee_service.py
│   │
│   ├── template.yaml
│   └── requirements.txt
│
├── template.yaml
├── samconfig.toml
├── requirements.txt
└── ReadMe.md
