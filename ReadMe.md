# Directory structure for employee-management project with CRUD operations

# Employee Management System
aws sts get-caller-identity

Go to respective deployment folders
sam build --use-container


1. First Go to shared-resources folder and deploy the shared resources:
sam deploy --template-file shared-resources.yaml --stack-name shared-resources-stack
2. Then deploy your service-specific stacks:
sam build --use-container
sam deploy --stack-name create-employee-stack

sam build --use-container
sam deploy --stack-name get-employee-stack


delete all stacks using aws command

aws cloudformation delete-stack --stack-name update-employee-stack
aws cloudformation delete-stack --stack-name delete-employee-stack
aws cloudformation delete-stack --stack-name get-employee-stack
aws cloudformation delete-stack --stack-name create-employee-stack
aws cloudformation delete-stack --stack-name  get-all-employees-stack
aws cloudformation delete-stack --stack-name shared-resources-stack


Problem: If no bucket is created, then create a bucket using the following command:
aws s3 mb s3://aws-sam-cli-managed-default-samclisourcebucket-za0nuebmdmed --region eu-north-1
# To delete the bucket, use the following command:
aws s3 rb s3://aws-sam-cli-managed-default-samclisourcebucket-za0nuebmdmed --force --region eu-north-1
# To delete the stack, use the following command:
aws cloudformation delete-stack --stack-name shared-resources-stack


