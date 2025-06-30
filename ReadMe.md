# Directory structure for employee-management project with CRUD operations

# Employee Management System

Go to respective deployment folders
sam build --use-container


1. First Go to shared-resources folder and deploy the shared resources:
sam deploy --template-file shared-resources.yaml --stack-name shared-resources-stack
2. Then deploy your service-specific stacks:
sam build --use-container
sam deploy --stack-name create-employee-stack

sam build --use-container
sam deploy --stack-name get-employee-stack
