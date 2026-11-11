import os
import sys
import subprocess

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.join(base_dir, "venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    print(f"🚀 Starting AI Resume Service on port 8000 using {venv_python}...")
    cmd = [
        venv_python,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
        "--reload"
    ]
    sys.exit(subprocess.call(cmd, cwd=base_dir))

if __name__ == "__main__":
    main()

