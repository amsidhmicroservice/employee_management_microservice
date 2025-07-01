@echo off
SETLOCAL ENABLEEXTENSIONS

echo =====================================
echo Running CREATE_EMPLOYEE_SERVICE tests
echo =====================================

REM Set PYTHONPATH for create_employee_service
set PYTHONPATH=.\create_employee_service\create_employee_lambda\src;.\commons\layers\shared\python

pytest -c tests\create_employee_service_pytest.ini tests\create_employee_service

echo.
echo Coverage report for create_employee_service:
echo → tests\create_employee_service\coverage\report\index.html
echo.

echo =====================================
echo Running GET_EMPLOYEE_SERVICE tests
echo =====================================

REM Set PYTHONPATH for get_employee_service
set PYTHONPATH=.\get_employee_service\get_employee_lambda\src;.\commons\layers\shared\python

pytest -c tests\get_employee_service_pytest.ini tests\get_employee_service

echo.
echo Coverage report for get_employee_service:
echo → tests\get_employee_service\coverage\report\index.html
echo.

ENDLOCAL
