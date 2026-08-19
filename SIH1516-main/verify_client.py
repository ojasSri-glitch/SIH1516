import urllib.request
import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

base_url = "http://localhost:8000"

print("--- 1. Testing Health Endpoint ---")
req = urllib.request.urlopen(f"{base_url}/api/health")
health_data = json.loads(req.read().decode("utf-8"))
print("Health:", json.dumps(health_data, indent=2))

print("\n--- 2. Testing Mistral AI Chat (Voice / Text Grievance with Location & PIN) ---")
payload = json.dumps({
    "message": "हमारे इलाके में 3 दिन से पानी की पाइपलाइन फटी हुई है, सेक्टर 14 रोहिणी 110085 में मदर डेयरी के पास",
    "preferred_language": "Hindi"
}).encode("utf-8")
req = urllib.request.Request(f"{base_url}/api/chat", data=payload, headers={"Content-Type": "application/json"})
res = urllib.request.urlopen(req)
chat_data = json.loads(res.read().decode("utf-8"))
print("AI Engine:", chat_data.get("engine"))
print("Bot Reply:", chat_data.get("reply"))
print("Extracted Data:", json.dumps(chat_data.get("extracted_data"), ensure_ascii=False, indent=2))

print("\n--- 3. Testing Mistral AI Officer Copilot Resolution Draft ---")
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
print("Copilot Draft:", json.dumps(copilot_data.get("draft"), ensure_ascii=False, indent=2))

print("\n--- 4. Testing Dedicated Mistral AI Template Generator ---")
tmpl_payload = json.dumps({
    "grievance_id": "JAN-2026-78412",
    "template_type": "work_order"
}).encode("utf-8")
req = urllib.request.Request(f"{base_url}/api/ai/generate-template", data=tmpl_payload, headers={"Content-Type": "application/json"})
res = urllib.request.urlopen(req)
tmpl_data = json.loads(res.read().decode("utf-8"))
print("Template Generated:", json.dumps(tmpl_data.get("template"), ensure_ascii=False, indent=2))

print("\n>>> ALL CHECKS COMPLETED SUCCESSFULLY! <<<")
