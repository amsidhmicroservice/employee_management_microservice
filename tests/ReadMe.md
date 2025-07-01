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


OR
We are created automatic pytest.ini file for test case run and generate report
Go to powershell and run following command in ps.

For create an employee service code coverage report run the following command
$env:PYTHONPATH = ".\create_employee_service\create_employee_lambda\src;.\commons\layers\shared\python"
pytest -c tests/create_employee_service_pytest.ini tests/create_employee_service

And
for get an employee service code coverage report run the following command
$env:PYTHONPATH = ".\get_employee_service\get_employee_lambda\src;.\commons\layers\shared\python"
pytest -c tests/get_employee_service_pytest.ini tests/get_employee_service


OR
open command prompt and run following command
.\run_all_tests.bat