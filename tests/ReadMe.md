Add requirements-test.txt file at root level directory
Run following command to install all test libraries in local machine
pip install -r requirements-test.txt
In powershell enter following command to link the dependencies source in root path
$env:PYTHONPATH = ".\create_employee_service\create_employee_lambda\src;.\commons\layers\shared\python"

To run the test case for individual py file
Use following commnand
pytest .\tests\create_employee_service\create_employee_handler_test.py

pytest .\tests\create_employee_service\create_employee_service_test.py
pytest .\tests\create_employee_service\create_employee_dao_test.py


To run all testcases and missing line report run the following command

pytest --cov=handler --cov=service --cov=dao --cov=backend_ip_client --cov-report=term-missing tests/

Here 
--cov=... --->Path to measure coverage (you may specify individual modules too)
--cov-report=term-missing	---->Show lines not covered in the terminal output
tests/	----->Folder containing your test files

For html report use following command
pytest --cov=handler --cov=service --cov=dao  --cov=backend_ip_client --cov-report=html tests/

Then open:htmlcov/index.html