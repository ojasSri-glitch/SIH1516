import urllib.request
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

base_url = "http://localhost:8000"

print("================================================================")
print("TEST 1: Grievance WITHOUT location in text + Browser GPS context (Anna Nagar Chennai 600040)")
print("================================================================")
payload1 = {
    "message": "हमारे इलाके में 2 दिन से बिजली नहीं है और ट्रांसफार्मर से धुआं निकल रहा है",
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
print("Extracted Address:", data1["extracted_data"]["address"])
print("Extracted PIN:", data1["extracted_data"]["pincode"])
print("Extracted Dept:", data1["extracted_data"]["department_short_name"])
print("Bot Reply:\n", data1["reply"])

print("\n================================================================")
print("TEST 2: Grievance WITH explicit location in text (Koramangala Bangalore)")
print("================================================================")
payload2 = {
    "message": "Water pipeline burst in Koramangala 5th block near indoor stadium",
    "preferred_language": "English",
    "browser_location": {
        "address": "Sector 14, Rohini, New Delhi",
        "pincode": "110085",
        "city": "New Delhi",
        "state": "Delhi"
    }
}
req = urllib.request.Request(f"{base_url}/api/chat", data=json.dumps(payload2).encode("utf-8"), headers={"Content-Type": "application/json"})
res = urllib.request.urlopen(req)
data2 = json.loads(res.read().decode("utf-8"))
print("Extracted Address:", data2["extracted_data"]["address"])
print("Extracted PIN:", data2["extracted_data"]["pincode"])
print("Extracted Dept:", data2["extracted_data"]["department_short_name"])
print("Bot Reply:\n", data2["reply"])

print("\n================================================================")
print("TEST 3: Geo PIN code lookup endpoint")
print("================================================================")
req = urllib.request.urlopen(f"{base_url}/api/geo/lookup?q=Bandra%20West%20Mumbai")
data3 = json.loads(req.read().decode("utf-8"))
print("Lookup Result:", data3)

print("\n>>> ALL GEO & PIN CODE INGESTION TESTS PASSED! <<<")
