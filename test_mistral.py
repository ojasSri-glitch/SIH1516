import urllib.request
import json
import ssl
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
api_key = 'WI867vwHWtpTgwFQL5Z8ytlRGx859TqA'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

system_prompt = """You are the AI Officer Copilot & Resolution Template Generator of JanSamvaad AI (SIH1516).
Given a citizen grievance with location, PIN code, landmark, department, and issue description, generate a complete official government action template.

Return ONLY valid JSON matching this schema:
{
  "suggested_action_notes": "Detailed technical and field action notes outlining site inspection, repair work executed at the specific location, and verification details.",
  "citizen_sms_draft": "Polite, official resolution message in the citizen's native language containing Token ID, category, department name, and closure note.",
  "sop_checklist": [
    "1. Field inspection step at the specific location",
    "2. Technical isolation / safety protocol",
    "3. Geo-tagged BEFORE resolution photo proof",
    "4. Corrective engineering / maintenance action",
    "5. Geo-tagged AFTER resolution photo proof & supervisor signoff",
    "6. Automated SMS dispatch to citizen"
  ],
  "estimated_manpower": "Recommended crew (e.g., 1 Junior Engineer + 2 Technicians + 1 Excavator Operator)",
  "priority_level": "Critical/High/Medium/Low",
  "preventive_recommendations": "Preventative measure to avoid recurrence at this PIN code/locality",
  "official_notice_template": "Formal departmental work order / closure memo format"
}"""

sample_grievance = {
    "id": "JAN-2026-78412",
    "citizen_name": "Aarav Sharma",
    "citizen_phone": "+91 98112 34567",
    "department_name": "Ministry of Jal Shakti / Water Supply & Sewerage",
    "department_short_name": "Jal Shakti / Water",
    "category": "Jal Shakti / Water Redressal",
    "sub_category": "Main Pipeline Burst",
    "urgency": "Critical",
    "address": "Sector 14, Rohini, Delhi",
    "pincode": "110085",
    "landmark": "Near Mother Dairy",
    "original_language": "Hindi",
    "original_text": "हमारे इलाके में 3 दिन से पानी नहीं आ रहा है, सेक्टर 14 रोहिणी दिल्ली 110085 में मदर डेयरी के पास पाइपलाइन टूटी है",
    "translated_text": "No water supply for 3 days due to burst pipeline near Mother Dairy in Sector 14 Rohini Delhi 110085."
}

payload = {
    "model": "mistral-small-latest",
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Generate resolution template and officer copilot draft for this grievance: {json.dumps(sample_grievance, ensure_ascii=False)}"}
    ],
    "response_format": {"type": "json_object"},
    "temperature": 0.2
}

req = urllib.request.Request(
    "https://api.mistral.ai/v1/chat/completions",
    data=json.dumps(payload).encode("utf-8"),
    headers=headers
)
res = urllib.request.urlopen(req, context=ctx)
data = json.loads(res.read().decode("utf-8"))
content = data["choices"][0]["message"]["content"]
parsed = json.loads(content)
print(json.dumps(parsed, ensure_ascii=False, indent=2))
