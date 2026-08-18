"""
JanSamvaad AI - Root Server Launcher (SIH1516)
Run this script to launch the full-stack system:
python run_server.py
"""

import os
import sys

# Ensure backend directory is in python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
sys.path.insert(0, BACKEND_DIR)

from app import start_server

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    print("Initializing JanSamvaad AI Platform...")
    start_server(port)
