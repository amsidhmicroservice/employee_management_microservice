✅ ### How to Zip a Python Lambda Function
Assume you have this:

```
employee-authorizer/
├── employee_authorizer_function.py
├── requirements.txt
└── README.md
```

🎯 Method 1 — Simple Zip (No Dependencies)
1. Navigate to the `employee-authorizer` directory:
   ```bash
   cd employee-authorizer
   ```
2. Create a zip file:
   ```bash
    zip -r employee_authorizer.zip employee_authorizer_function.py
    ```

🎯 Method 2 — Including Dependencies   
1. Navigate to the `employee-authorizer` directory:
   ```bash
   cd employee-authorizer
   ```  
2. Install dependencies into a `python` directory:
   ```bash
    pip install -r requirements.txt -t python
    ```
3. Create a zip file including the `python` directory:
4. ```bash
    zip -r employee_authorizer.zip python employee_authorizer_function.py
    ```
5. Clean up the `python` directory if needed:
6. ```bash
    rm -rf python
    ```
7. Your `employee_authorizer.zip` is now ready for deployment.
8. You can now upload this zip file to AWS Lambda or any other service that requires it.
```bash
    aws lambda update-function-code --function-name your_lambda_function_name --zip-file fileb://employee_authorizer.zip
```
OR
9. Directly deploy it using AWS SAM or any other deployment tool you prefer.

