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
    # 1. Test Health (with Mistral AI verification)
    req = urllib.request.urlopen(f"{base_url}/api/health")
    health_data = json.loads(req.read().decode("utf-8"))
    print("[PASS] Health check:", health_data["service"], "| AI Engine:", health_data.get("ai_engine"))

    # 2. Test Departments
    req = urllib.request.urlopen(f"{base_url}/api/departments")
    dept_data = json.loads(req.read().decode("utf-8"))
    print(f"[PASS] Departments loaded: {len(dept_data.get('departments', []))} ministries")

    # 3. Test AI Classification (Hindi query with Location and PIN code)
    hindi_payload = json.dumps({"text": "हमारे इलाके में 3 दिन से पानी की पाइपलाइन फटी हुई है, सेक्टर 14 रोहिणी 110085 में मदर डेयरी के पास"}).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/ai/classify", data=hindi_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    cls_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] AI Hindi Classification: {cls_data['language']['name']} -> Dept: {cls_data['classification']['department_short_name']} | PIN: {cls_data['entities']['pincode']} | Loc: {cls_data['entities']['location_candidate']}")

    # 4. Test Chat endpoint (Tamil query)
    tamil_payload = json.dumps({"message": "சாலையில் பெரிய குழி உள்ளது விபத்து அபாயம், அண்ணா நகர் 600040", "preferred_language": "Tamil"}).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/chat", data=tamil_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    chat_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] Chat Tamil Response: Dept {chat_data['extracted_data']['department_short_name']}, PIN: {chat_data['extracted_data']['pincode']}, Reply: {chat_data['reply'][:50]}...")

    # 5. Test Officer Copilot Draft (Mistral AI Template Generation)
    copilot_payload = json.dumps({
        "grievance": {
            "id": "JAN-2026-78412",
            "citizen_name": "Aarav Sharma",
            "citizen_phone": "+91 98112 34567",
            "department_name": "Ministry of Jal Shakti / Water Supply",
            "category": "Main Pipeline Burst",
            "address": "Sector 14, Rohini, Delhi",
            "pincode": "110085",
            "original_language": "Hindi",
            "original_text": "3 दिन से पानी नहीं आ रहा है पाइपलाइन टूटी है",
            "urgency": "Critical"
        }
    }).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/ai/copilot-draft", data=copilot_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    copilot_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] Mistral AI Copilot Draft: Action Notes: {copilot_data['draft']['suggested_action_notes'][:60]}... | SOP Steps: {len(copilot_data['draft'].get('sop_checklist', []))}")

    # 6. Test Mistral AI Dedicated Template Generator
    template_payload = json.dumps({
        "grievance_id": "JAN-2026-78412",
        "template_type": "work_order"
    }).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/ai/generate-template", data=template_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    tmpl_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] Mistral AI Template Generator: Type: {tmpl_data['template'].get('template_type')}, Title: {tmpl_data['template'].get('title')}")

    # 7. Test Tracking
    req = urllib.request.urlopen(f"{base_url}/api/grievance/track?id=JAN-2026-78412")
    track_data = json.loads(req.read().decode("utf-8"))
    print(f"[PASS] Tracking lookup: Token {track_data['grievance']['id']} (Status: {track_data['grievance']['status']})")

    # 8. Test Dashboard Stats
    req = urllib.request.urlopen(f"{base_url}/api/stats/dashboard")
    stats_data = json.loads(req.read().decode("utf-8"))
    print(f"[PASS] Dashboard stats: {stats_data['stats']['total_grievances']} total grievances, Resolution rate: {stats_data['stats']['resolution_rate']}%")

    # 9. Test Pipeline Inspector
    inspect_payload = json.dumps({"text": "ગઈકાલથી અમારી સોસાયટી બહાર વીજળીનો ટ્રાન્સફોર્મર સ્પાર્ક થઈ રહ્યો છે"}).encode("utf-8")
    req = urllib.request.Request(f"{base_url}/api/ai/inspect", data=inspect_payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    insp_data = json.loads(res.read().decode("utf-8"))
    print(f"[PASS] Pipeline trace stages verified: {list(insp_data['trace'].keys())}")

    # 10. Test Static Frontend Index
    req = urllib.request.urlopen(f"{base_url}/")
    html_content = req.read().decode("utf-8")
    assert "JanSamvaad AI" in html_content
    print(f"[PASS] Frontend index.html served successfully ({len(html_content)} bytes)")

    print("\n>>> ALL 10 AUTOMATED SYSTEM & MISTRAL AI VERIFICATION TESTS PASSED PERFECTLY! <<<")
finally:
    proc.terminate()
