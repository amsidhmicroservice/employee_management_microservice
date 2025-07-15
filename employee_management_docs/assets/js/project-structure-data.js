// Project structure data
const projectStructure = {
    name: "employee_management_system",
    type: "folder",
    expanded: true,
    children: [
        {
            name: "src",
            type: "folder",
            description: "Source code for Lambda functions",
            expanded: true,
            children: [
                {
                    name: "create_employee",
                    type: "folder",
                    description: "Create employee Lambda function",
                    children: [
                        {
                            name: "lambda_function.py",
                            type: "file",
                            size: "3.2 KB",
                            language: "python",
                            description: "Main handler for creating new employees",
                            details: {
                                purpose: "Handles POST requests to create new employee records",
                                inputs: "Employee data via API Gateway event",
                                outputs: "201 Created with employee data or error response",
                                dependencies: ["boto3", "json", "uuid", "datetime"],
                                functions: ["lambda_handler", "validate_input", "create_employee"]
                            }
                        },
                        {
                            name: "requirements.txt",
                            type: "file",
                            size: "128 B",
                            description: "Python dependencies for this function"
                        }
                    ]
                },
                {
                    name: "get_employee",
                    type: "folder",
                    description: "Get employee Lambda function",
                    children: [
                        {
                            name: "lambda_function.py",
                            type: "file",
                            size: "2.1 KB",
                            language: "python",
                            description: "Main handler for retrieving employee data",
                            details: {
                                purpose: "Handles GET requests for individual employee records",
                                inputs: "Employee ID via path parameters",
                                outputs: "200 OK with employee data or 404 Not Found",
                                dependencies: ["boto3", "json"],
                                functions: ["lambda_handler", "get_employee_by_id"]
                            }
                        },
                        {
                            name: "requirements.txt",
                            type: "file",
                            size: "64 B",
                            description: "Python dependencies for this function"
                        }
                    ]
                },
                {
                    name: "update_employee",
                    type: "folder",
                    description: "Update employee Lambda function",
                    children: [
                        {
                            name: "lambda_function.py",
                            type: "file",
                            size: "2.8 KB",
                            language: "python",
                            description: "Main handler for updating employee data",
                            details: {
                                purpose: "Handles PUT requests to update existing employee records",
                                inputs: "Employee ID and update data",
                                outputs: "200 OK with updated data or error response",
                                dependencies: ["boto3", "json", "datetime"],
                                functions: ["lambda_handler", "validate_updates", "update_employee"]
                            }
                        },
                        {
                            name: "requirements.txt",
                            type: "file",
                            size: "96 B",
                            description: "Python dependencies for this function"
                        }
                    ]
                },
                {
                    name: "delete_employee",
                    type: "folder",
                    description: "Delete employee Lambda function",
                    children: [
                        {
                            name: "lambda_function.py",
                            type: "file",
                            size: "1.9 KB",
                            language: "python",
                            description: "Main handler for deleting employee records",
                            details: {
                                purpose: "Handles DELETE requests to remove employee records",
                                inputs: "Employee ID via path parameters",
                                outputs: "204 No Content or error response",
                                dependencies: ["boto3", "json"],
                                functions: ["lambda_handler", "delete_employee_by_id"]
                            }
                        },
                        {
                            name: "requirements.txt",
                            type: "file",
                            size: "64 B",
                            description: "Python dependencies for this function"
                        }
                    ]
                },
                {
                    name: "list_employees",
                    type: "folder",
                    description: "List employees Lambda function",
                    children: [
                        {
                            name: "lambda_function.py",
                            type: "file",
                            size: "2.5 KB",
                            language: "python",
                            description: "Main handler for listing employees with filters",
                            details: {
                                purpose: "Handles GET requests to list employees with optional filtering",
                                inputs: "Query parameters for filtering (department, etc.)",
                                outputs: "200 OK with employee list",
                                dependencies: ["boto3", "json"],
                                functions: ["lambda_handler", "list_employees", "apply_filters"]
                            }
                        },
                        {
                            name: "requirements.txt",
                            type: "file",
                            size: "64 B",
                            description: "Python dependencies for this function"
                        }
                    ]
                },
                {
                    name: "shared",
                    type: "folder",
                    description: "Shared utilities and common code",
                    children: [
                        {
                            name: "python",
                            type: "folder",
                            description: "Python shared libraries",
                            children: [
                                {
                                    name: "utils.py",
                                    type: "file",
                                    size: "4.1 KB",
                                    language: "python",
                                    description: "Common utility functions",
                                    details: {
                                        purpose: "Shared utility functions used across Lambda functions",
                                        functions: ["generate_response", "validate_email", "format_datetime", "sanitize_input"],
                                        dependencies: ["json", "re", "datetime"],
                                        usage: "Imported by all Lambda functions"
                                    }
                                },
                                {
                                    name: "db_client.py",
                                    type: "file",
                                    size: "3.8 KB",
                                    language: "python",
                                    description: "DynamoDB client wrapper",
                                    details: {
                                        purpose: "Centralized DynamoDB operations with error handling",
                                        functions: ["get_item", "put_item", "update_item", "delete_item", "scan_table"],
                                        dependencies: ["boto3", "botocore"],
                                        usage: "Database abstraction layer"
                                    }
                                },
                                {
                                    name: "validators.py",
                                    type: "file",
                                    size: "2.3 KB",
                                    language: "python",
                                    description: "Input validation functions",
                                    details: {
                                        purpose: "Centralized input validation and schema checking",
                                        functions: ["validate_employee_data", "validate_email_format", "validate_phone"],
                                        dependencies: ["re", "jsonschema"],
                                        usage: "Data validation across all endpoints"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "infrastructure",
            type: "folder",
            description: "AWS infrastructure and deployment",
            children: [
                {
                    name: "template.yaml",
                    type: "file",
                    size: "8.7 KB",
                    language: "yaml",
                    description: "SAM template for serverless deployment",
                    details: {
                        purpose: "Defines all AWS resources and their configurations",
                        resources: ["Lambda Functions", "API Gateway", "DynamoDB Table", "IAM Roles"],
                        deployment: "Used with SAM CLI for automated deployment",
                        environments: "Supports dev, staging, and production"
                    }
                },
                {
                    name: "cloudformation",
                    type: "folder",
                    description: "CloudFormation templates",
                    children: [
                        {
                            name: "dynamodb.yaml",
                            type: "file",
                            size: "1.2 KB",
                            language: "yaml",
                            description: "DynamoDB table configuration"
                        },
                        {
                            name: "api-gateway.yaml",
                            type: "file",
                            size: "2.1 KB",
                            language: "yaml",
                            description: "API Gateway configuration"
                        }
                    ]
                },
                {
                    name: "scripts",
                    type: "folder",
                    description: "Deployment and build scripts",
                    children: [
                        {
                            name: "deploy.sh",
                            type: "file",
                            size: "892 B",
                            description: "Deployment script for all environments"
                        },
                        {
                            name: "build.sh",
                            type: "file",
                            size: "654 B",
                            description: "Build script for Lambda packages"
                        }
                    ]
                }
            ]
        },
        {
            name: "tests",
            type: "folder",
            description: "Test suite and testing utilities",
            children: [
                {
                    name: "unit",
                    type: "folder",
                    description: "Unit tests for individual functions",
                    children: [
                        {
                            name: "test_create_employee.py",
                            type: "file",
                            size: "3.4 KB",
                            language: "python",
                            description: "Unit tests for create employee function"
                        },
                        {
                            name: "test_get_employee.py",
                            type: "file",
                            size: "2.1 KB",
                            language: "python",
                            description: "Unit tests for get employee function"
                        },
                        {
                            name: "test_shared_utils.py",
                            type: "file",
                            size: "2.8 KB",
                            language: "python",
                            description: "Unit tests for shared utilities"
                        }
                    ]
                },
                {
                    name: "integration",
                    type: "folder",
                    description: "Integration tests with AWS services",
                    children: [
                        {
                            name: "test_api_endpoints.py",
                            type: "file",
                            size: "5.2 KB",
                            language: "python",
                            description: "End-to-end API testing"
                        },
                        {
                            name: "test_database.py",
                            type: "file",
                            size: "3.1 KB",
                            language: "python",
                            description: "DynamoDB integration tests"
                        }
                    ]
                },
                {
                    name: "fixtures",
                    type: "folder",
                    description: "Test data and mock responses",
                    children: [
                        {
                            name: "sample_employees.json",
                            type: "file",
                            size: "1.8 KB",
                            language: "json",
                            description: "Sample employee data for testing"
                        },
                        {
                            name: "api_responses.json",
                            type: "file",
                            size: "2.3 KB",
                            language: "json",
                            description: "Expected API response formats"
                        }
                    ]
                }
            ]
        },
        {
            name: "employee_management_docs",
            type: "folder",
            description: "Documentation website",
            expanded: true,
            children: [
                {
                    name: "index.html",
                    type: "file",
                    size: "12.4 KB",
                    language: "html",
                    description: "Main documentation homepage"
                },
                {
                    name: "pages",
                    type: "folder",
                    description: "Documentation pages",
                    children: [
                        {
                            name: "api-flows.html",
                            type: "file",
                            size: "18.7 KB",
                            language: "html",
                            description: "API flows and documentation hub"
                        },
                        {
                            name: "architecture.html",
                            type: "file",
                            size: "45.2 KB",
                            language: "html",
                            description: "System architecture documentation"
                        },
                        {
                            name: "project-structure.html",
                            type: "file",
                            size: "32.1 KB",
                            language: "html",
                            description: "Project structure documentation"
                        }
                    ]
                },
                {
                    name: "assets",
                    type: "folder",
                    description: "CSS, JS, and static assets",
                    children: [
                        {
                            name: "css",
                            type: "folder",
                            description: "Stylesheets",
                            children: [
                                {
                                    name: "main.css",
                                    type: "file",
                                    size: "8.1 KB",
                                    language: "css",
                                    description: "Main stylesheet"
                                },
                                {
                                    name: "components.css",
                                    type: "file",
                                    size: "5.3 KB",
                                    language: "css",
                                    description: "Component-specific styles"
                                }
                            ]
                        },
                        {
                            name: "js",
                            type: "folder",
                            description: "JavaScript files",
                            children: [
                                {
                                    name: "main.js",
                                    type: "file",
                                    size: "6.7 KB",
                                    language: "javascript",
                                    description: "Main JavaScript functionality"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "README.md",
            type: "file",
            size: "4.2 KB",
            language: "markdown",
            description: "Project overview and setup instructions",
            details: {
                purpose: "Main project documentation and getting started guide",
                sections: ["Overview", "Architecture", "Setup", "Deployment", "Contributing"],
                audience: "Developers, stakeholders, and new team members",
                maintenance: "Updated with each major release"
            }
        },
        {
            name: ".gitignore",
            type: "file",
            size: "892 B",
            description: "Git ignore patterns"
        },
        {
            name: "requirements.txt",
            type: "file",
            size: "234 B",
            description: "Project-level Python dependencies"
        },
        {
            name: "package.json",
            type: "file",
            size: "1.1 KB",
            language: "json",
            description: "Node.js dependencies for documentation build"
        }
    ]
};

// File type icons mapping
const fileIcons = {
    folder: 'fas fa-folder',
    'folder-open': 'fas fa-folder-open',
    python: 'fab fa-python',
    json: 'fas fa-file-code',
    yaml: 'fas fa-file-code',
    html: 'fab fa-html5',
    css: 'fab fa-css3-alt',
    javascript: 'fab fa-js-square',
    markdown: 'fab fa-markdown',
    txt: 'fas fa-file-alt',
    sh: 'fas fa-terminal'
};

// Sample code snippets
const sampleCode = {
    'lambda_function.py': `import json
import boto3
from datetime import datetime
import uuid

def lambda_handler(event, context):
    """
    Main Lambda handler for employee operations
    """
    try:
        # Parse the incoming event
        http_method = event['httpMethod']
        
        if http_method == 'POST':
            return create_employee(event)
        elif http_method == 'GET':
            return get_employee(event)
        elif http_method == 'PUT':
            return update_employee(event)
        elif http_method == 'DELETE':
            return delete_employee(event)
        else:
            return {
                'statusCode': 405,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def create_employee(event):
    """Create a new employee record"""
    # Implementation here
    pass`,
    'utils.py': `import json
import re
from datetime import datetime

def generate_response(status_code, body, headers=None):
    """Generate standardized API response"""
    response = {
        'statusCode': status_code,
        'body': json.dumps(body) if isinstance(body, dict) else body,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    }
    
    if headers:
        response['headers'].update(headers);
    
    return response

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def format_datetime(dt=None):
    """Format datetime to ISO string"""
    if dt is None:
        dt = datetime.utcnow()
    return dt.isoformat() + 'Z'`
};