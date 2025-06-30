# Directory structure for employee-management project with CRUD operations

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


## Build and Deploy Process

1. Setup dependencies:
```bash
# Run the dependency management script
python scripts/manage_dependencies.py

# Build the project
sam build --use-container

# Deploy
sam deploy --guided
```

Note: The script uses symbolic links on Unix-like systems and copies on Windows (since Windows requires special permissions for symlinks). This way:

1. We maintain only one `requirements.txt` file in the root directory
2. The script automatically sets up the required files in the correct locations
3. Changes to dependencies only need to be made in one place
4. The build process remains compatible with SAM's requirements

This solution:
- Follows DRY principle
- Makes maintenance easier
- Keeps the build process automated
- Works cross-platform
- Maintains compatibility with SAM's requirements

You can now manage all your dependencies in a single file while the script handles the distribution of the requirements file to the necessary locations in your project structure.


aws sts get-caller-identity

pip install --upgrade awscli
