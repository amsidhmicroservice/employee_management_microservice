import os
import shutil
import subprocess
from pathlib import Path


def setup_dependencies():
    project_root = Path(__file__).parent.parent
    requirements_file = project_root / "requirements.txt"

    # Define target directories
    layers_dep_dir = project_root / "layers" / "dependencies"
    layers_python_dir = layers_dep_dir / "python"
    lambda_dir = project_root / "add_employee_service" / "add_employee_lambda"

    # Create directories if they don't exist
    layers_python_dir.mkdir(parents=True, exist_ok=True)

    # Clean existing dependencies
    if layers_python_dir.exists():
        print("Cleaning existing dependencies...")
        shutil.rmtree(layers_python_dir)
        layers_python_dir.mkdir(parents=True)

    # Install dependencies
    print("Installing dependencies...")
    subprocess.run([
        "pip", "install",
        "-r", str(requirements_file),
        "-t", str(layers_python_dir),
        "--upgrade"
    ], check=True)

    # Create symbolic links or copies of requirements.txt
    if not (layers_dep_dir / "requirements.txt").exists():
        if os.name == 'nt':  # Windows
            shutil.copy2(requirements_file, layers_dep_dir / "requirements.txt")
        else:  # Unix-like
            os.symlink(requirements_file, layers_dep_dir / "requirements.txt")

    if not (lambda_dir / "requirements.txt").exists():
        if os.name == 'nt':  # Windows
            shutil.copy2(requirements_file, lambda_dir / "requirements.txt")
        else:  # Unix-like
            os.symlink(requirements_file, lambda_dir / "requirements.txt")

    print("Dependencies setup completed successfully!")


if __name__ == "__main__":
    setup_dependencies()