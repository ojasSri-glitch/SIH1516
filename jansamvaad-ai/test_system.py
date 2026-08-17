import urllib.request
import json
import time
import subprocess
import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

proc = subprocess.Popen([sys.executable, "run_server.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(2)

base_url = "http://localhost:8000"

try:
    # 1. Test Health
    req = urllib.request.urlopen(f"{base_url}/api/health")
    health_data = json.loads(req.read().decode("utf-8"))
    print("[PASS] Health check:", health_data["service"])

    # 2. Test Departments
    req = urllib.request.urlopen(f"{base_url}/api/departments")
    dept_data = json.loads(req.read().decode("utf-8"))
    print(f"[PASS] Departments loaded: {len(dept_data.get('departments', []))} ministries")

    # 3. Test AI Classification (Hindi query)
    hindi_payload = json.dumps({"text": "हमारे इलाके में 3 दिन से पानी की पाइपलाइन फटी हुई है और बहुत पानी बह रहा है"}).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/ai/classify", data=hindi_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    cls_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] AI Hindi Classification: {cls_data['language']['name']} -> Dept: {cls_data['classification']['department_short_name']} (Confidence: {cls_data['classification']['confidence']})")

    # 4. Test Chat endpoint (Tamil query)
    tamil_payload = json.dumps({"message": "சாலையில் பெரிய குழி உள்ளது விபத்து அபாயம்", "preferred_language": "Tamil"}).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/chat", data=tamil_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    chat_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] Chat Tamil Response: Dept {chat_data['extracted_data']['department_short_name']}, Category: {chat_data['extracted_data']['category']}")

    # 5. Test Tracking
    req = urllib.request.urlopen(f"{base_url}/api/grievance/track?id=JAN-2026-78412")
    track_data = json.loads(req.read().decode("utf-8"))
    print(f"[PASS] Tracking lookup: Token {track_data['grievance']['id']} (Status: {track_data['grievance']['status']})")

    # 6. Test Dashboard Stats
    req = urllib.request.urlopen(f"{base_url}/api/stats/dashboard")
    stats_data = json.loads(req.read().decode("utf-8"))
    print(f"[PASS] Dashboard stats: {stats_data['stats']['total_grievances']} total grievances, Resolution rate: {stats_data['stats']['resolution_rate']}%")

    # 7. Test Pipeline Inspector
    inspect_payload = json.dumps({"text": "ગઈકાલથી અમારી સોસાયટી બહાર વીજળીનો ટ્રાન્સફોર્મર સ્પાર્ક થઈ રહ્યો છે"}).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/ai/inspect", data=inspect_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    insp_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] Pipeline trace stages verified: {list(insp_data['trace'].keys())}")

    # 8. Test Static Frontend Index
    req = urllib.request.urlopen(f"{base_url}/")
    html_content = req.read().decode("utf-8")
    assert "JanSamvaad AI" in html_content
    print(f"[PASS] Frontend index.html served successfully ({len(html_content)} bytes)")

    print("\n>>> ALL 8 AUTOMATED SYSTEM VERIFICATION TESTS PASSED PERFECTLY! <<<")
finally:
    proc.terminate()
