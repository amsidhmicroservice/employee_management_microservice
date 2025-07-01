$env:PYTHONPATH = ".\commons\layers\shared\python"
pytest tests/shared

OR

$env:PYTHONPATH = ".\commons\layers\shared\python"
pytest -c tests/shared_pytest.ini tests/shared
