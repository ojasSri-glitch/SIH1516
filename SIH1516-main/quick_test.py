import urllib.request
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

base_url = "http://localhost:8000"

payload1 = {
    "message": "हमारे इलाके में पानी नहीं आ रहा है",
    "preferred_language": "Hindi",
    "browser_location": {
        "address": "2nd Avenue, Anna Nagar, Chennai",
        "pincode": "600040",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "latitude": 13.0850,
        "longitude": 80.2100
    }
}

req = urllib.request.Request(f"{base_url}/api/chat", data=json.dumps(payload1).encode("utf-8"), headers={"Content-Type": "application/json"})
res = urllib.request.urlopen(req)
data1 = json.loads(res.read().decode("utf-8"))
print("Extracted Address:", data1["extracted_data"]["address"], flush=True)
print("Extracted PIN:", data1["extracted_data"]["pincode"], flush=True)
print("Extracted Dept:", data1["extracted_data"]["department_short_name"], flush=True)
print("Bot Reply:\n", data1["reply"], flush=True)
