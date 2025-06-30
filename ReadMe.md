# Directory structure for employee-management project with CRUD operations

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


aws cloudformation delete-stack --stack-name add-employee-service-stack
