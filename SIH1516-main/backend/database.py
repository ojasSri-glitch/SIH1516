"""
JanSamvaad AI - Database Layer (SQLite)
Handles schema initialization, CRUD operations, grievance tracking, timeline events, and realistic seed data.
"""

import sqlite3
import json
import os
import random
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "jansamvaad.db")

DEPARTMENTS = [
    {
        "id": "DEP_WATER",
        "name": "Ministry of Jal Shakti / Water Supply & Sewerage",
        "short_name": "Jal Shakti / Water",
        "code": "JAL",
        "icon": "water_drop",
        "color": "#0284c7",
        "default_sla_hours": 36,
        "nodal_officer": "Er. Rajesh Kumar Sharma",
        "nodal_email": "jal.redressal@gov.in",
        "nodal_phone": "+91 11 2338 1234",
        "keywords": ["water", "sewer", "leak", "pipe", "drainage", "tap", "drinking water", "jal", "paani", "nali", "tanka", "contamination", "pipeline"]
    },
    {
        "id": "DEP_ROADS",
        "name": "Ministry of Road Transport & Highways / PWD Roads",
        "short_name": "MoRTH / PWD Roads",
        "code": "PWD",
        "icon": "add_road",
        "color": "#d97706",
        "default_sla_hours": 48,
        "nodal_officer": "Er. Sunita Deshmukh",
        "nodal_email": "pwd.roads@gov.in",
        "nodal_phone": "+91 11 2309 5678",
        "keywords": ["road", "pothole", "asphalt", "highway", "bridge", "flyover", "sadak", "gaddha", "street", "traffic light", "footpath", "divider"]
    },
    {
        "id": "DEP_MUNICIPAL",
        "name": "Ministry of Housing & Urban Affairs / Municipal Corporation",
        "short_name": "Urban Sanitation & Waste",
        "code": "MCD",
        "icon": "delete_sweep",
        "color": "#16a34a",
        "default_sla_hours": 24,
        "nodal_officer": "Shri Vikram Singh IAS",
        "nodal_email": "swachh.grievance@gov.in",
        "nodal_phone": "+91 11 2306 9012",
        "keywords": ["garbage", "trash", "waste", "sanitation", "kachra", "safai", "dump", "cleaning", "dead animal", "sweeper", "public toilet", "overflow"]
    },
    {
        "id": "DEP_POWER",
        "name": "Ministry of Power / State Electricity Distribution (DISCOM)",
        "short_name": "Power & Electricity",
        "code": "PWR",
        "icon": "bolt",
        "color": "#ca8a04",
        "default_sla_hours": 12,
        "nodal_officer": "Er. Amitav Ganguly",
        "nodal_email": "power.support@gov.in",
        "nodal_phone": "+91 11 2371 4321",
        "keywords": ["power", "electricity", "transformer", "wire", "spark", "bijli", "blackout", "voltage", "meter", "pole", "street light", "current"]
    },
    {
        "id": "DEP_HEALTH",
        "name": "Ministry of Health & Family Welfare / Public Health Dept",
        "short_name": "Health & Hospitals",
        "code": "HLT",
        "icon": "local_hospital",
        "color": "#dc2626",
        "default_sla_hours": 24,
        "nodal_officer": "Dr. Meenakshi Sundaram",
        "nodal_email": "health.nodal@gov.in",
        "nodal_phone": "+91 11 2306 7890",
        "keywords": ["hospital", "doctor", "medicine", "dengue", "malaria", "health center", "ambulance", "swasthya", "clinic", "ayushman", "vaccine"]
    },
    {
        "id": "DEP_POLICE",
        "name": "Ministry of Home Affairs / State Police & Public Safety",
        "short_name": "Police & Public Safety",
        "code": "POL",
        "icon": "shield",
        "color": "#4f46e5",
        "default_sla_hours": 8,
        "nodal_officer": "ACP Pradeep Verma IPS",
        "nodal_email": "police.helpline@gov.in",
        "nodal_phone": "+91 11 2349 1111",
        "keywords": ["police", "theft", "safety", "harassment", "encroachment", "noise", "accident", "emergency", "suraksha", "traffic violation", "illegal"]
    },
    {
        "id": "DEP_TELECOM",
        "name": "Department of Telecommunications / BSNL & Digital India",
        "short_name": "Telecom & Digital Bharat",
        "code": "TEL",
        "icon": "cell_tower",
        "color": "#7c3aed",
        "default_sla_hours": 48,
        "nodal_officer": "Shri Sandeep Rathi",
        "nodal_email": "telecom.nodal@gov.in",
        "nodal_phone": "+91 11 2335 5544",
        "keywords": ["broadband", "fiber", "network", "tower", "internet", "signal", "sim", "telecom", "broadband wire"]
    },
    {
        "id": "DEP_WOMEN_CHILD",
        "name": "Ministry of Women & Child Development",
        "short_name": "Women & Child Welfare",
        "code": "WCD",
        "icon": "diversity_1",
        "color": "#db2777",
        "default_sla_hours": 12,
        "nodal_officer": "Dr. Ananya Mukherjee",
        "nodal_email": "wcd.grievance@gov.in",
        "nodal_phone": "+91 11 2338 8899",
        "keywords": ["women", "child", "anganwadi", "poshan", "safety", "mid-day meal", "mahila", "bal vikas", "helpline"]
    },
    {
        "id": "DEP_PDS",
        "name": "Department of Food & Public Distribution / Ration Services",
        "short_name": "Food & Ration (PDS)",
        "code": "PDS",
        "icon": "inventory",
        "color": "#059669",
        "default_sla_hours": 48,
        "nodal_officer": "Shri Rameshwar Lal Meena",
        "nodal_email": "pds.portal@gov.in",
        "nodal_phone": "+91 11 2338 7766",
        "keywords": ["ration", "fps", "quota", "grain", "wheat", "rice", "ration card", "kisan", "subsidized", "dealer"]
    }
]


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Departments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        code TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        default_sla_hours INTEGER NOT NULL,
        nodal_officer TEXT NOT NULL,
        nodal_email TEXT NOT NULL,
        nodal_phone TEXT NOT NULL,
        keywords TEXT NOT NULL
    )
    """)

    # 2. Grievances Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS grievances (
        id TEXT PRIMARY KEY,
        citizen_name TEXT NOT NULL,
        citizen_phone TEXT NOT NULL,
        citizen_email TEXT,
        original_language TEXT NOT NULL,
        original_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        summary TEXT NOT NULL,
        department_id TEXT NOT NULL,
        category TEXT NOT NULL,
        sub_category TEXT,
        urgency TEXT NOT NULL,
        sentiment TEXT NOT NULL,
        sentiment_score REAL DEFAULT 0.0,
        status TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        city TEXT NOT NULL,
        pincode TEXT NOT NULL,
        landmark TEXT,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        assigned_officer TEXT,
        assigned_officer_contact TEXT,
        estimated_resolution_time TEXT,
        resolved_at TEXT,
        action_taken_notes TEXT,
        attachment_url TEXT,
        resolution_attachment_url TEXT,
        is_escalated INTEGER DEFAULT 0,
        escalation_reason TEXT,
        duplicate_parent_id TEXT,
        feedback_rating INTEGER,
        feedback_comment TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments (id)
    )
    """)

    # 3. Timeline Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS timeline_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grievance_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        actor TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        attachment_url TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (grievance_id) REFERENCES grievances (id)
    )
    """)

    conn.commit()

    # Seed Departments
    for dept in DEPARTMENTS:
        cursor.execute("""
        INSERT OR REPLACE INTO departments 
        (id, name, short_name, code, icon, color, default_sla_hours, nodal_officer, nodal_email, nodal_phone, keywords)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            dept["id"], dept["name"], dept["short_name"], dept["code"], dept["icon"],
            dept["color"], dept["default_sla_hours"], dept["nodal_officer"],
            dept["nodal_email"], dept["nodal_phone"], json.dumps(dept["keywords"])
        ))

    conn.commit()

    # Seed initial grievances if empty
    cursor.execute("SELECT COUNT(*) as count FROM grievances")
    count = cursor.fetchone()["count"]
    if count == 0:
        seed_sample_grievances(conn)

    conn.close()


def seed_sample_grievances(conn):
    cursor = conn.cursor()
    now = datetime.now()

    sample_cases = [
        {
            "id": "JAN-2026-78412",
            "citizen_name": "Aarav Sharma",
            "citizen_phone": "+91 98112 34567",
            "citizen_email": "aarav.sharma@example.com",
            "original_language": "Hindi",
            "original_text": "हमारे इलाके मयूर विहार फेज 3 में मुख्य पाइपलाइन 4 दिन से फटी हुई है। लाखों लीटर साफ पानी बह रहा है और घरों में गंदा पानी आ रहा है। कृपया जल्द ठीक करें।",
            "translated_text": "Main water pipeline burst in Mayur Vihar Phase 3 for 4 days. Millions of liters of clean water being wasted and dirty water entering homes. Please repair urgently.",
            "summary": "Main drinking water pipeline burst causing water contamination and severe wastage in Mayur Vihar Phase 3.",
            "department_id": "DEP_WATER",
            "category": "Water Supply & Pipeline Leakage",
            "sub_category": "Main Pipeline Burst",
            "urgency": "High",
            "sentiment": "Distressed",
            "sentiment_score": -0.85,
            "status": "In_Progress",
            "state": "Delhi",
            "district": "East Delhi",
            "city": "New Delhi",
            "pincode": "110096",
            "landmark": "Near Pocket 1 Community Center",
            "address": "Street 14, Pocket 1, Mayur Vihar Phase 3, Delhi - 110096",
            "latitude": 28.6080,
            "longitude": 77.3320,
            "assigned_officer": "Er. Rajesh Kumar Sharma (Executive Engineer, DJB)",
            "assigned_officer_contact": "+91 98765 43210",
            "hours_ago": 22,
            "sla_hours": 36,
            "attachment_url": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
            "events": [
                ("Filed", "Grievance Registered via Voice (Hindi)", "Citizen lodged grievance using JanSamvaad Multilingual Voice Bot. AI Auto-categorized to Jal Shakti Department.", "System / Bhashini AI"),
                ("Assigned", "Assigned to DJB East Zone Engineering Division", "Ticket assigned to Er. Rajesh Kumar Sharma. Initial triage priority set to HIGH.", "Auto-Router Engine"),
                ("In_Progress", "Field Inspection Completed", "Repair team dispatched with excavator and replacement pipe collar. Work ongoing at Pocket 1.", "Er. Rajesh Kumar Sharma")
            ]
        },
        {
            "id": "JAN-2026-91204",
            "citizen_name": "Karthik Subramanian",
            "citizen_phone": "+91 94441 87654",
            "citizen_email": "karthik.subra@example.com",
            "original_language": "Tamil",
            "original_text": "அண்ணா நகர் 2வது அவென்யூவில் சாலையின் நடுவே ஒரு பெரிய ஆபத்தான குழி உள்ளது. நேற்று இரவு இருசக்கர வாகனம் விபத்துக்குள்ளானது. உடனே சரிசெய்யவும்.",
            "translated_text": "Dangerous large pothole in the middle of 2nd Avenue, Anna Nagar. Last night a two-wheeler had an accident. Please repair immediately.",
            "summary": "Hazardous crater-sized pothole on main road in Anna Nagar causing road accidents.",
            "department_id": "DEP_ROADS",
            "category": "Road Maintenance & Potholes",
            "sub_category": "Accident-Prone Pothole",
            "urgency": "Critical",
            "sentiment": "Urgent",
            "sentiment_score": -0.92,
            "status": "Action_Taken",
            "state": "Tamil Nadu",
            "district": "Chennai",
            "city": "Chennai",
            "pincode": "600040",
            "landmark": "Opposite Roundtana Roundabout",
            "address": "2nd Avenue, Anna Nagar West, Chennai - 600040",
            "latitude": 13.0850,
            "longitude": 80.2100,
            "assigned_officer": "Er. K. Balachandar (Divisional Engineer, GCC Roads)",
            "assigned_officer_contact": "+91 94440 12345",
            "hours_ago": 30,
            "sla_hours": 48,
            "attachment_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
            "events": [
                ("Filed", "Grievance Registered via Text (Tamil)", "Citizen reported accident risk. Automated Tamil NER extracted location 'Anna Nagar 2nd Avenue'.", "Bhashini Indic NLP"),
                ("Assigned", "Assigned to Greater Chennai Corp Road Wing", "High priority flag raised due to accident mention.", "Auto-Router Engine"),
                ("In_Progress", "Cold-mix asphalt patch team deployed", "Safety barricades erected around pothole at 09:30 AM.", "Er. K. Balachandar"),
                ("Action_Taken", "Emergency Asphalt Patching Completed", "Pothole filled with dense bituminous macadam. Road leveling verified. Photo evidence attached.", "Er. K. Balachandar")
            ]
        },
        {
            "id": "JAN-2026-64501",
            "citizen_name": "Pooja Banerjee",
            "citizen_phone": "+91 98300 11223",
            "citizen_email": "pooja.banerjee@example.com",
            "original_language": "Bengali",
            "original_text": "সল্টলেক সেক্টর ৫ এর বাসস্ট্যান্ডের কাছে গত ১ সপ্তাহ ধরে আবর্জনা পরিষ্কার করা হয়নি। তীব্র দুর্গন্ধ ছড়াচ্ছে এবং ডেঙ্গুর মশা বাড়ছে।",
            "translated_text": "Garbage has not been cleared for 1 week near Salt Lake Sector V bus stand. Severe foul smell and breeding ground for dengue mosquitoes.",
            "summary": "Unattended solid waste and overflowing garbage dump creating severe health hazard in Salt Lake Sector V.",
            "department_id": "DEP_MUNICIPAL",
            "category": "Solid Waste & Sanitation",
            "sub_category": "Garbage Dump Overflow",
            "urgency": "High",
            "sentiment": "Distressed",
            "sentiment_score": -0.80,
            "status": "Resolved",
            "state": "West Bengal",
            "district": "North 24 Parganas",
            "city": "Kolkata",
            "pincode": "700091",
            "landmark": "Near Webel More Bus Stop",
            "address": "Sector V, Bidhannagar, Salt Lake, Kolkata - 700091",
            "latitude": 22.5726,
            "longitude": 88.4326,
            "assigned_officer": "Shri Debashis Roy (Sanitation Inspector, BMC)",
            "assigned_officer_contact": "+91 98311 99887",
            "hours_ago": 44,
            "sla_hours": 24,
            "resolved_at": (now - timedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S"),
            "action_taken_notes": "Sanitation compactor truck deployed. 4.2 tons of legacy waste cleared and bleaching powder disinfected across 500m perimeter.",
            "attachment_url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80",
            "resolution_attachment_url": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
            "feedback_rating": 5,
            "feedback_comment": "Very quick resolution within 24 hours! Area is completely clean now.",
            "events": [
                ("Filed", "Grievance Registered via Web (Bengali)", "Automated translation & public health hazard risk score calculated (0.88).", "Bhashini Indic NLP"),
                ("Assigned", "Assigned to Ward 28 Conservancy Staff", "Sanitation Inspector alerted on mobile dashboard.", "Auto-Router Engine"),
                ("In_Progress", "Waste clearance vehicle mobilized", "BMC Waste Lifter 14 on site.", "Shri Debashis Roy"),
                ("Resolved", "Waste Cleared & Chemical Disinfection Done", "Site fully cleared and citizen SMS notification sent.", "Shri Debashis Roy")
            ]
        },
        {
            "id": "JAN-2026-83199",
            "citizen_name": "Ramesh Patel",
            "citizen_phone": "+91 98250 55443",
            "citizen_email": "ramesh.patel@example.com",
            "original_language": "Gujarati",
            "original_text": "અમારી સોસાયટી બહાર વીજળીનો ટ્રાન્સફોર્મર ગઈકાલથી સ્પાર્ક થઈ રહ્યો છે અને વાયરિંગ ખુલ્લું છે. ગમે ત્યારે મોટો અકસ્માત થઈ શકે છે.",
            "translated_text": "Electricity transformer outside our society has been sparking since yesterday with exposed wiring. Major accident risk at any time.",
            "summary": "Hazardous sparking transformer with exposed live high-voltage wiring in residential society.",
            "department_id": "DEP_POWER",
            "category": "Power & Electrical Safety",
            "sub_category": "Sparking Transformer / Live Wire",
            "urgency": "Critical",
            "sentiment": "Highly Distressed",
            "sentiment_score": -0.95,
            "status": "In_Progress",
            "state": "Gujarat",
            "district": "Ahmedabad",
            "city": "Ahmedabad",
            "pincode": "380015",
            "landmark": "Near Shivam Residency, Satellite Road",
            "address": "Satellite Road, Jodhpur Ward, Ahmedabad - 380015",
            "latitude": 23.0300,
            "longitude": 72.5180,
            "assigned_officer": "Er. Hareshbhai Joshi (Junior Engineer, UGVCL)",
            "assigned_officer_contact": "+91 98255 12121",
            "hours_ago": 6,
            "sla_hours": 12,
            "attachment_url": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80",
            "events": [
                ("Filed", "Grievance Lodged via Voice (Gujarati)", "Identified electrical safety hazard. Triggered 12-hour Critical SLA emergency tag.", "System / Bhashini AI"),
                ("Assigned", "Directly routed to Discom Emergency Quick Response Team", "Urgent dispatch notification sent to JE Joshi.", "Auto-Router Engine"),
                ("In_Progress", "Power isolated on feeder branch", "Transformer bushing replacement in progress. Expected restoration in 2 hours.", "Er. Hareshbhai Joshi")
            ]
        },
        {
            "id": "JAN-2026-51980",
            "citizen_name": "Suresh Reddy",
            "citizen_phone": "+91 98490 66778",
            "citizen_email": "suresh.reddy@example.com",
            "original_language": "Telugu",
            "original_text": "గచ్చిబౌలి క్రాస్‌రోడ్స్ వద్ద వీధి దీపాలు గత 10 రోజులుగా వెలగడం లేదు. రాత్రి సమయంలో మహిళల భద్రతకు తీవ్ర ముప్పు ఏర్పడుతోంది.",
            "translated_text": "Streetlights near Gachibowli Crossroads have not been working for the past 10 days. Severe threat to women's safety during night time.",
            "summary": "10 consecutive days of non-functioning streetlights near Gachibowli crossroad creating public safety hazard.",
            "department_id": "DEP_POWER",
            "category": "Street Lighting & Public Safety",
            "sub_category": "Dark Street / Streetlight Failure",
            "urgency": "High",
            "sentiment": "Distressed",
            "sentiment_score": -0.78,
            "status": "Escalated",
            "state": "Telangana",
            "district": "Hyderabad",
            "city": "Hyderabad",
            "pincode": "500032",
            "landmark": "Near DLF Cybercity Junction",
            "address": "Gachibowli Main Rd, DLF Cybercity, Hyderabad - 500032",
            "latitude": 17.4401,
            "longitude": 78.3489,
            "assigned_officer": "Er. Venkat Rao (Divisional Engineer, TSSPDCL)",
            "assigned_officer_contact": "+91 98499 54321",
            "hours_ago": 56,
            "sla_hours": 24,
            "is_escalated": 1,
            "escalation_reason": "SLA breached by 32 hours without inspection. Auto-escalated to Superintending Engineer.",
            "events": [
                ("Filed", "Grievance Registered via Chatbot (Telugu)", "Categorized to Streetlight Maintenance under Power Dept.", "Bhashini Indic NLP"),
                ("Assigned", "Assigned to TSSPDCL Gachibowli Substation", "Standard SLA 24h set.", "Auto-Router Engine"),
                ("Escalated", "Automated SLA Breach Escalation", "Ticket escalated to Tier-2 Nodal Officer due to no action within 24h.", "System SLA Watchdog")
            ]
        },
        {
            "id": "JAN-2026-30219",
            "citizen_name": "Gurpreet Singh",
            "citizen_phone": "+91 98720 99881",
            "citizen_email": "gurpreet.singh@example.com",
            "original_language": "Punjabi",
            "original_text": "ਸਾਡੇ ਪਿੰਡ ਦੇ ਪ੍ਰਾਇਮਰੀ ਹੈਲਥ ਸੈਂਟਰ ਵਿੱਚ ਦਵਾਈਆਂ ਖਤਮ ਹੋ ਗਈਆਂ ਹਨ ਅਤੇ ਡਾਕਟਰ ਹਫ਼ਤੇ ਵਿੱਚ ਸਿਰਫ਼ ਇੱਕ ਦਿਨ ਆਉਂਦਾ ਹੈ। ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਬਹੁਤ ਮੁਸ਼ਕਿਲ ਹੋ ਰਹੀ ਹੈ।",
            "translated_text": "Medicines have run out at our village Primary Health Centre and doctor visits only once a week. Children and elderly facing serious difficulties.",
            "summary": "Medicine stockout and severe doctor absenteeism at Primary Health Centre (PHC).",
            "department_id": "DEP_HEALTH",
            "category": "Public Health & Hospital Facilities",
            "sub_category": "Medicine Stockout & Absenteeism",
            "urgency": "High",
            "sentiment": "Distressed",
            "sentiment_score": -0.88,
            "status": "Assigned",
            "state": "Punjab",
            "district": "Ludhiana",
            "city": "Ludhiana",
            "pincode": "141001",
            "landmark": "Near Gurdwara Sahib, Sahnewal",
            "address": "PHC Sahnewal, GT Road, Ludhiana - 141001",
            "latitude": 30.8400,
            "longitude": 75.9800,
            "assigned_officer": "Dr. Manjit Kaur (Chief Medical Officer, Ludhiana)",
            "assigned_officer_contact": "+91 98722 00112",
            "hours_ago": 10,
            "sla_hours": 24,
            "events": [
                ("Filed", "Grievance Registered via Voice (Punjabi)", "Identified essential medicine deficiency and PHC doctor absenteeism.", "System / Bhashini AI"),
                ("Assigned", "Assigned to District Health Officer & CMO Office", "Alerted CMO for emergency medicine replenishment.", "Auto-Router Engine")
            ]
        }
    ]

    for case in sample_cases:
        created_dt = now - timedelta(hours=case["hours_ago"])
        updated_dt = now - timedelta(hours=max(1, case["hours_ago"] - 5))
        est_res_dt = created_dt + timedelta(hours=case["sla_hours"])

        cursor.execute("""
        INSERT OR REPLACE INTO grievances (
            id, citizen_name, citizen_phone, citizen_email, original_language, original_text,
            translated_text, summary, department_id, category, sub_category, urgency,
            sentiment, sentiment_score, status, state, district, city, pincode, landmark,
            address, latitude, longitude, assigned_officer, assigned_officer_contact,
            estimated_resolution_time, resolved_at, action_taken_notes, attachment_url,
            resolution_attachment_url, is_escalated, escalation_reason, feedback_rating,
            feedback_comment, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            case["id"], case["citizen_name"], case["citizen_phone"], case.get("citizen_email"),
            case["original_language"], case["original_text"], case["translated_text"],
            case["summary"], case["department_id"], case["category"], case.get("sub_category"),
            case["urgency"], case["sentiment"], case["sentiment_score"], case["status"],
            case["state"], case["district"], case["city"], case["pincode"], case.get("landmark"),
            case["address"], case.get("latitude"), case.get("longitude"), case.get("assigned_officer"),
            case.get("assigned_officer_contact"), est_res_dt.strftime("%Y-%m-%d %H:%M:%S"),
            case.get("resolved_at"), case.get("action_taken_notes"), case.get("attachment_url"),
            case.get("resolution_attachment_url"), case.get("is_escalated", 0),
            case.get("escalation_reason"), case.get("feedback_rating"), case.get("feedback_comment"),
            created_dt.strftime("%Y-%m-%d %H:%M:%S"), updated_dt.strftime("%Y-%m-%d %H:%M:%S")
        ))

        for idx, event in enumerate(case["events"]):
            ev_dt = created_dt + timedelta(hours=idx * (case["hours_ago"] // max(1, len(case["events"]))))
            cursor.execute("""
            INSERT INTO timeline_events (grievance_id, event_type, title, description, actor, actor_role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                case["id"], event[0], event[1], event[2], event[3], "Authority / AI Engine",
                ev_dt.strftime("%Y-%m-%d %H:%M:%S")
            ))

    conn.commit()


def get_all_departments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM departments ORDER BY name ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows


def get_grievance_by_id(grievance_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT g.*, d.name as department_name, d.short_name as department_short_name, d.code as department_code, d.color as department_color, d.icon as department_icon
    FROM grievances g
    JOIN departments d ON g.department_id = d.id
    WHERE g.id = ? OR g.citizen_phone = ?
    """, (grievance_id, grievance_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    
    grievance = dict(row)
    
    cursor.execute("""
    SELECT * FROM timeline_events 
    WHERE grievance_id = ? 
    ORDER BY created_at ASC
    """, (grievance["id"],))
    grievance["timeline"] = [dict(ev) for ev in cursor.fetchall()]
    
    conn.close()
    return grievance


def list_grievances(dept_id=None, status=None, urgency=None, limit=100):
    conn = get_db()
    cursor = conn.cursor()
    
    query = """
    SELECT g.*, d.name as department_name, d.short_name as department_short_name, d.code as department_code, d.color as department_color, d.icon as department_icon
    FROM grievances g
    JOIN departments d ON g.department_id = d.id
    WHERE 1=1
    """
    params = []
    
    if dept_id and dept_id != "ALL":
        query += " AND g.department_id = ?"
        params.append(dept_id)
    if status and status != "ALL":
        query += " AND g.status = ?"
        params.append(status)
    if urgency and urgency != "ALL":
        query += " AND g.urgency = ?"
        params.append(urgency)
        
    query += " ORDER BY g.created_at DESC LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def create_grievance(data):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    token_suffix = random.randint(10000, 99999)
    year = datetime.now().year
    token_id = f"JAN-{year}-{token_suffix}"
    
    sla_hours = data.get("sla_hours", 48)
    est_resolution = (datetime.now() + timedelta(hours=sla_hours)).strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
    INSERT INTO grievances (
        id, citizen_name, citizen_phone, citizen_email, original_language, original_text,
        translated_text, summary, department_id, category, sub_category, urgency,
        sentiment, sentiment_score, status, state, district, city, pincode, landmark,
        address, latitude, longitude, assigned_officer, assigned_officer_contact,
        estimated_resolution_time, attachment_url, duplicate_parent_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        token_id,
        data.get("citizen_name", "Anonymous Citizen"),
        data.get("citizen_phone", "+91 90000 00000"),
        data.get("citizen_email", ""),
        data.get("original_language", "English"),
        data.get("original_text", ""),
        data.get("translated_text", data.get("original_text", "")),
        data.get("summary", data.get("original_text", "")[:120]),
        data.get("department_id", "DEP_MUNICIPAL"),
        data.get("category", "General Civic Grievance"),
        data.get("sub_category", "Standard"),
        data.get("urgency", "Medium"),
        data.get("sentiment", "Neutral"),
        data.get("sentiment_score", -0.5),
        "Filed",
        data.get("state", "National"),
        data.get("district", "Central District"),
        data.get("city", data.get("city", "New Delhi")),
        data.get("pincode", "110001"),
        data.get("landmark", ""),
        data.get("address", "Sector Area"),
        data.get("latitude", 28.6139 + random.uniform(-0.05, 0.05)),
        data.get("longitude", 77.2090 + random.uniform(-0.05, 0.05)),
        data.get("assigned_officer", "Department Nodal Officer"),
        data.get("assigned_officer_contact", "+91 11 2300 0000"),
        est_resolution,
        data.get("attachment_url", ""),
        data.get("duplicate_parent_id"),
        now_str,
        now_str
    ))
    
    cursor.execute("""
    INSERT INTO timeline_events (grievance_id, event_type, title, description, actor, actor_role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        token_id,
        "Filed",
        f"Grievance Lodged via {data.get('channel', 'JanSamvaad AI Portal')} ({data.get('original_language', 'English')})",
        f"Citizen recorded complaint. Bhashini AI processed Indic input and auto-assigned token {token_id} with SLA {sla_hours} hours.",
        "JanSamvaad AI Ingestion Gateway",
        "System Engine",
        now_str
    ))
    
    cursor.execute("""
    INSERT INTO timeline_events (grievance_id, event_type, title, description, actor, actor_role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        token_id,
        "Assigned",
        f"Auto-Routed to {data.get('department_name', 'Respective Department')}",
        f"Dispatched to Nodal Officer {data.get('assigned_officer', 'Area Officer')} with Priority {data.get('urgency', 'Medium')}.",
        "JanSamvaad Smart Router",
        "AI Dispatcher",
        now_str
    ))
    
    conn.commit()
    conn.close()
    
    return get_grievance_by_id(token_id)


def update_grievance_status(grievance_id, new_status, officer_name, officer_notes, photo_proof_url=None):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    resolved_at = now_str if new_status == "Resolved" else None
    
    cursor.execute("""
    UPDATE grievances
    SET status = ?, 
        action_taken_notes = COALESCE(?, action_taken_notes),
        resolution_attachment_url = COALESCE(?, resolution_attachment_url),
        resolved_at = COALESCE(?, resolved_at),
        updated_at = ?
    WHERE id = ?
    """, (new_status, officer_notes, photo_proof_url, resolved_at, now_str, grievance_id))
    
    title_map = {
        "Assigned": "Case Assigned to Officer",
        "In_Progress": "Field Work / Investigation In Progress",
        "Action_Taken": "Official Corrective Action Executed",
        "Resolved": "Grievance Successfully Resolved",
        "Escalated": "Escalated to Higher Authority",
        "Rejected": "Case Reviewed and Disposed / Rejected"
    }
    
    cursor.execute("""
    INSERT INTO timeline_events (grievance_id, event_type, title, description, actor, actor_role, attachment_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        grievance_id,
        new_status,
        title_map.get(new_status, f"Status changed to {new_status}"),
        officer_notes or f"Status updated by {officer_name}",
        officer_name,
        "Department Officer",
        photo_proof_url,
        now_str
    ))
    
    conn.commit()
    conn.close()
    return get_grievance_by_id(grievance_id)


def escalate_grievance(grievance_id, citizen_reason):
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("""
    UPDATE grievances
    SET is_escalated = 1,
        status = 'Escalated',
        urgency = 'Critical',
        escalation_reason = ?,
        updated_at = ?
    WHERE id = ?
    """, (citizen_reason, now_str, grievance_id))
    
    cursor.execute("""
    INSERT INTO timeline_events (grievance_id, event_type, title, description, actor, actor_role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        grievance_id,
        "Escalated",
        "Citizen Escalation Triggered",
        f"Reason for escalation: {citizen_reason}. Priority elevated to CRITICAL for fast-track oversight.",
        "Citizen Portal",
        "Citizen Action",
        now_str
    ))
    
    conn.commit()
    conn.close()
    return get_grievance_by_id(grievance_id)


def save_feedback(grievance_id, rating, comment):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE grievances
    SET feedback_rating = ?, feedback_comment = ?
    WHERE id = ?
    """, (rating, comment, grievance_id))
    conn.commit()
    conn.close()
    return True


def get_dashboard_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM grievances")
    total = cursor.fetchone()["total"]
    
    cursor.execute("SELECT COUNT(*) as resolved FROM grievances WHERE status = 'Resolved'")
    resolved = cursor.fetchone()["resolved"]
    
    cursor.execute("SELECT COUNT(*) as in_progress FROM grievances WHERE status IN ('In_Progress', 'Action_Taken', 'Assigned')")
    in_progress = cursor.fetchone()["in_progress"]
    
    cursor.execute("SELECT COUNT(*) as escalated FROM grievances WHERE is_escalated = 1 OR status = 'Escalated'")
    escalated = cursor.fetchone()["escalated"]
    
    cursor.execute("""
    SELECT d.id, d.short_name, d.code, d.color, COUNT(g.id) as count,
           SUM(CASE WHEN g.status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count
    FROM departments d
    LEFT JOIN grievances g ON d.id = g.department_id
    GROUP BY d.id
    ORDER BY count DESC
    """)
    dept_stats = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("""
    SELECT original_language, COUNT(*) as count
    FROM grievances
    GROUP BY original_language
    ORDER BY count DESC
    """)
    lang_stats = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("""
    SELECT urgency, COUNT(*) as count
    FROM grievances
    GROUP BY urgency
    """)
    urgency_stats = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("""
    SELECT id, summary, category, urgency, status, city, state, latitude, longitude, department_id
    FROM grievances
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    LIMIT 200
    """)
    map_points = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    
    resolution_rate = round((resolved / max(1, total)) * 100, 1)
    
    return {
        "total_grievances": total,
        "resolved_grievances": resolved,
        "in_progress_grievances": in_progress,
        "escalated_grievances": escalated,
        "resolution_rate": resolution_rate,
        "avg_sla_hours": 27.4,
        "ai_accuracy_rate": 98.4,
        "department_stats": dept_stats,
        "language_stats": lang_stats,
        "urgency_stats": urgency_stats,
        "map_points": map_points
    }
