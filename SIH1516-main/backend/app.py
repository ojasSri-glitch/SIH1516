"""
JanSamvaad AI - Full-Stack REST API & Web Application Server
Multi-threaded Python HTTP Server providing REST APIs and static file delivery.
Robust Unicode & Error Handling for all Indic scripts on Windows & Linux.
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys
import traceback
import base64
from datetime import datetime

# Configure Windows stdout/stderr for Unicode UTF-8
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Import backend modules
sys.path.insert(0, os.path.dirname(__file__))
import database
from ai_engine import ai_engine, LANGUAGES, DEPARTMENT_RULES

PORT = 8000
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")


class JanSamvaadHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def _read_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw_body = self.rfile.read(content_length).decode("utf-8", errors="replace")
                return json.loads(raw_body)
        except Exception as e:
            print(f"Error reading JSON body: {e}")
        return {}

    def _send_json(self, data, status=200):
        try:
            self._set_headers(status, "application/json; charset=utf-8")
            payload = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
            self.wfile.write(payload)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, OSError):
            pass
        except Exception as e:
            print(f"Error in _send_json: {e}")

    # Routing GET requests
    def do_GET(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            query = urllib.parse.parse_qs(parsed.query)

            # REST API endpoints
            if path == "/api/health":
                self._send_json({
                    "status": "ok",
                    "service": "JanSamvaad AI Backend",
                    "ai_engine": f"Mistral AI ({ai_engine.mistral_model})",
                    "timestamp": datetime.now().isoformat()
                })
                return

            if path == "/api/geo/lookup":
                q = query.get("q", [""])[0].strip()
                from ai_engine import lookup_pincode
                res = lookup_pincode(q)
                self._send_json({"success": True, "query": q, "result": res})
                return

            if path == "/api/location/reverse":
                lat_str = query.get("lat", ["28.6139"])[0].strip()
                lon_str = query.get("lon", ["77.2090"])[0].strip()
                try:
                    lat = float(lat_str)
                    lon = float(lon_str)
                except ValueError:
                    lat, lon = 28.6139, 77.2090
                from ai_engine import reverse_geocode_coordinates
                loc_res = reverse_geocode_coordinates(lat, lon)
                self._send_json({"success": True, "location": loc_res})
                return

            if path == "/api/location/current":
                from ai_engine import get_ip_location
                loc_res = get_ip_location()
                self._send_json({"success": True, "location": loc_res})
                return

            if path == "/api/departments":
                departments = database.get_all_departments()
                self._send_json({"success": True, "departments": departments})
                return

            if path == "/api/grievance/track":
                grievance_id = query.get("id", [""])[0].strip()
                if not grievance_id:
                    self._send_json({"success": False, "error": "Missing 'id' parameter"}, 400)
                    return
                grievance = database.get_grievance_by_id(grievance_id)
                if not grievance:
                    self._send_json({"success": False, "error": f"No grievance found for ID/Phone '{grievance_id}'"}, 404)
                    return
                self._send_json({"success": True, "grievance": grievance})
                return

            if path == "/api/grievance/list":
                dept = query.get("dept", ["ALL"])[0]
                status = query.get("status", ["ALL"])[0]
                urgency = query.get("urgency", ["ALL"])[0]
                grievances = database.list_grievances(dept, status, urgency)
                self._send_json({"success": True, "count": len(grievances), "grievances": grievances})
                return

            if path == "/api/stats/dashboard":
                stats = database.get_dashboard_stats()
                self._send_json({"success": True, "stats": stats})
                return

            # Default static file handler (Serves index.html, styles.css, js files)
            return super().do_GET()
        except Exception as e:
            traceback.print_exc()
            self._send_json({"success": False, "error": str(e)}, 500)

    # Routing POST requests
    def do_POST(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            body = self._read_json_body()

            # 0. Officer Authentication Endpoint
            if path == "/api/officer/login":
                username = body.get("username", "").strip()
                password = body.get("password", "").strip()

                if username.lower() == "mukund" and password == "1234":
                    self._send_json({
                        "success": True,
                        "token": "auth-token-mukund-sih1516",
                        "officer": {
                            "username": "mukund",
                            "name": "Officer Mukund",
                            "designation": "Executive Nodal Officer",
                            "badge_id": "NODAL-GOV-8821"
                        }
                    })
                else:
                    self._send_json({
                        "success": False,
                        "error": "Invalid officer credentials. Please check username and password."
                    }, 401)
                return

            # 1. AI Classification & Routing Endpoint
            if path == "/api/ai/classify":
                text = body.get("text", "").strip()
                if not text:
                    self._send_json({"success": False, "error": "Empty text supplied"}, 400)
                    return

                lang_info = ai_engine.detect_language(text)
                norm = ai_engine.normalize_and_translate(text, lang_info["name"])
                classification = ai_engine.classify_intent_and_department(text, norm["translated_text"])
                entities = ai_engine.extract_entities(text)
                sla_hours = ai_engine.calculate_sla_hours(entities["urgency"], classification["default_sla_hours"])

                # Check duplicates against recent grievances
                existing = database.list_grievances(limit=50)
                dup_info = ai_engine.check_duplicate_grievance(text, entities.get("pincode"), existing)

                response = {
                    "success": True,
                    "language": lang_info,
                    "translation": norm,
                    "classification": classification,
                    "entities": entities,
                    "calculated_sla_hours": sla_hours,
                    "duplicate_analysis": dup_info
                }
                self._send_json(response)
                return

            # 2. Conversational Chatbot Endpoint
            if path == "/api/chat":
                message = body.get("message", "").strip()
                session = body.get("session", {})
                history = body.get("history", [])

                if not message:
                    self._send_json({"success": False, "error": "Empty message"}, 400)
                    return

                lang_info = ai_engine.detect_language(message)
                user_lang = body.get("preferred_language") or lang_info["name"]
                norm = ai_engine.normalize_and_translate(message, lang_info["name"])
                entities = ai_engine.extract_entities(message)
                classification = ai_engine.classify_intent_and_department(message, norm["translated_text"])
                sla_hours = ai_engine.calculate_sla_hours(entities["urgency"], classification["default_sla_hours"])

                browser_loc = body.get("browser_location", {})
                if browser_loc and isinstance(browser_loc, dict):
                    if browser_loc.get("pincode") and (not entities.get("pincode") or not entities["pincode"]):
                        entities["pincode"] = browser_loc.get("pincode")
                    if browser_loc.get("address") and (not entities.get("location_candidate") or entities["location_candidate"] in ["हमारे", "Your Specified Locality", "Civic Ward", "Identified Sector"]):
                        entities["location_candidate"] = browser_loc.get("address")
                
                # Automatic server IP fallback if no PIN detected yet
                if not entities.get("pincode") or entities.get("pincode") == "110001":
                    from ai_engine import get_ip_location
                    ip_loc = get_ip_location()
                    if ip_loc and ip_loc.get("pincode"):
                        entities["pincode"] = ip_loc.get("pincode")
                        if not entities.get("location_candidate") or entities["location_candidate"] in ["हमारे", "Your Specified Locality", "Civic Ward", "Identified Sector"]:
                            entities["location_candidate"] = ip_loc.get("locality") or ip_loc.get("address") or ip_loc.get("city")

                bot_reply = ""
                action = "continue"

                # Check if this is a tracking query
                track_match = None
                words = message.upper().split()
                for w in words:
                    if w.startswith("JAN-202") and len(w) >= 12:
                        track_match = w
                        break

                if "track" in message.lower() or "status" in message.lower() or track_match:
                    token_to_check = track_match
                    if token_to_check:
                        grv = database.get_grievance_by_id(token_to_check)
                        if grv:
                            bot_reply = f"Grievance {grv['id']} Status: **{grv['status']}**. Assigned to: {grv['assigned_officer']}. Category: {grv['category']}."
                            action = "track_found"
                        else:
                            bot_reply = f"No record found for token {token_to_check}. Please check the Token ID."
                    else:
                        bot_reply = "To track a grievance, please enter your Token ID (e.g. `JAN-2026-78412`) or registered Mobile Number."
                        action = "ask_token"
                else:
                    loc = entities["location_candidate"] or "Your Specified Locality"
                    pincode = entities["pincode"] or "Detected Area"
                    cat = classification["category"]
                    dept = classification["department_short_name"]

                    if user_lang == "Hindi" or lang_info["code"] == "hi":
                        bot_reply = f"नमस्ते! मैंने आपकी शिकायत दर्ज कर ली है। यह समस्या **{dept}** ({cat}) के अंतर्गत आती है।\n• क्षेत्र: {loc}\n• तात्कालिकता (Urgency): {entities['urgency']}\n• अनुमानित समाधान समय (SLA): {sla_hours} घंटे।\n\nकृपया टोकन जनरेट करने के लिए नीचे 'शिकायत दर्ज करें' बटन दबाएं।"
                    elif user_lang == "Tamil" or lang_info["code"] == "ta":
                        bot_reply = f"வணக்கம்! உங்கள் புகாரை நான் பதிவு செய்துள்ளேன். இது **{dept}** ({cat}) பிரிவைச் சார்ந்தது.\n• பகுதி: {loc}\n• முன்னுரிமை: {entities['urgency']}\n• தீர்வுக்கான கால வரம்பு: {sla_hours} மணிநேரம்.\n\nடோக்கன் பெற கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்."
                    elif user_lang == "Telugu" or lang_info["code"] == "te":
                        bot_reply = f"నమస్కారం! మీ ఫిర్యాదును నమోదు చేసుకున్నాను. ఇది **{dept}** ({cat}) పరిధిలోకి వస్తుంది.\n• ప్రాంతం: {loc}\n• ప్రాధాన్యత: {entities['urgency']}\n• పరిష్కార సమయం: {sla_hours} గంటలు."
                    elif user_lang == "Bengali" or lang_info["code"] == "bn":
                        bot_reply = f"নমস্কার! আপনার অভিযোগটি নথিভুক্ত করা হয়েছে। এটি **{dept}** ({cat}) বিভাগের আওতাভুক্ত।\n• এলাকা: {loc}\n• জরুরি অবস্থা: {entities['urgency']}\n• আনুমানিক সমাধানের সময়: {sla_hours} ঘন্টা।"
                    else:
                        bot_reply = f"Hello! I have captured your grievance regarding **{cat}**. Our AI has routed this to **{dept}**.\n• Location: {loc}\n• Urgency Level: {entities['urgency']}\n• Estimated SLA: {sla_hours} hours.\n\nPlease confirm below to receive your official Tracking Token."

                    action = "ready_to_file"

                self._send_json({
                    "success": True,
                    "engine": f"Mistral AI ({ai_engine.mistral_model})",
                    "reply": bot_reply,
                    "action": action,
                    "extracted_data": {
                        "original_text": message,
                        "translated_text": norm["translated_text"],
                        "summary": norm["summary"],
                        "language": lang_info["name"],
                        "department_id": classification["department_id"],
                        "department_name": classification["department_name"],
                        "department_short_name": classification["department_short_name"],
                        "category": classification["category"],
                        "sub_category": classification["sub_category"],
                        "urgency": entities["urgency"],
                        "sentiment": entities["sentiment"],
                        "pincode": entities["pincode"] or "110001",
                        "landmark": entities["landmark"] or "",
                        "address": entities["location_candidate"] or "Civic Ward",
                        "assigned_officer": classification["nodal_officer"],
                        "assigned_officer_contact": classification["nodal_contact"],
                        "sla_hours": sla_hours,
                        "confidence": classification["confidence"]
                    }
                })
                return

            # 3. Grievance Filing Endpoint
            if path == "/api/grievance/file":
                grievance = database.create_grievance(body)
                self._send_json({
                    "success": True,
                    "message": "Grievance successfully lodged with JanSamvaad AI",
                    "grievance": grievance
                })
                return

            # 4. Status Update Endpoint (Officer Action)
            if path == "/api/grievance/update_status":
                grievance_id = body.get("grievance_id")
                new_status = body.get("new_status")
                officer_name = body.get("officer_name", "Department Officer")
                officer_notes = body.get("officer_notes", "")
                photo_proof = body.get("photo_proof_url")

                if not grievance_id or not new_status:
                    self._send_json({"success": False, "error": "Missing grievance_id or new_status"}, 400)
                    return

                updated = database.update_grievance_status(grievance_id, new_status, officer_name, officer_notes, photo_proof)
                self._send_json({
                    "success": True,
                    "message": f"Status updated to {new_status}",
                    "grievance": updated
                })
                return

            # 5. Citizen Escalation Endpoint
            if path == "/api/grievance/escalate":
                grievance_id = body.get("grievance_id")
                reason = body.get("reason", "SLA breached or unsatisfactory progress")

                if not grievance_id:
                    self._send_json({"success": False, "error": "Missing grievance_id"}, 400)
                    return

                updated = database.escalate_grievance(grievance_id, reason)
                self._send_json({
                    "success": True,
                    "message": "Grievance successfully escalated to Tier-2 Nodal Authority",
                    "grievance": updated
                })
                return

            # 6. Citizen Feedback Endpoint
            if path == "/api/grievance/feedback":
                grievance_id = body.get("grievance_id")
                rating = int(body.get("rating", 5))
                comment = body.get("comment", "")

                if not grievance_id:
                    self._send_json({"success": False, "error": "Missing grievance_id"}, 400)
                    return

                database.save_feedback(grievance_id, rating, comment)
                self._send_json({"success": True, "message": "Feedback saved successfully"})
                return

            # 7. AI Officer Copilot Resolution Draft Endpoint
            if path == "/api/ai/copilot-draft":
                grievance_id = body.get("grievance_id")
                grv = database.get_grievance_by_id(grievance_id) if grievance_id else body.get("grievance", {})
                if not grv:
                    self._send_json({"success": False, "error": "Grievance data not found"}, 404)
                    return

                draft = ai_engine.generate_officer_resolution_draft(grv)
                self._send_json({"success": True, "draft": draft})
                return

            # 7b. Mistral AI Dedicated Template Generator Endpoint
            if path == "/api/ai/generate-template":
                grievance_id = body.get("grievance_id")
                template_type = body.get("template_type", "work_order")
                grv = database.get_grievance_by_id(grievance_id) if grievance_id else body.get("grievance", {})
                if not grv:
                    grv = {"id": grievance_id or "JAN-2026", "category": "General Redressal", "department_name": "Public Services"}

                template_data = ai_engine.generate_mistral_template(grv, template_type)
                self._send_json(template_data)
                return

            # 8. Bhashini / Indic NLP Pipeline Inspector
            if path == "/api/ai/inspect":
                sample_text = body.get("text", "हमारे इलाके में 3 दिन से पानी नहीं आ रहा है, पाइपलाइन टूटी है").strip()
                lang_info = ai_engine.detect_language(sample_text)
                norm = ai_engine.normalize_and_translate(sample_text, lang_info["name"])
                classification = ai_engine.classify_intent_and_department(sample_text, norm["translated_text"])
                entities = ai_engine.extract_entities(sample_text)
                existing = database.list_grievances(limit=30)
                dup_info = ai_engine.check_duplicate_grievance(sample_text, entities.get("pincode"), existing)

                pipeline_trace = {
                    "stage_1_bhashini_stt": {
                        "status": "COMPLETED",
                        "input_audio_waveform": "44.1kHz Indic Speech Stream",
                        "transcribed_text": sample_text,
                        "detected_language": lang_info
                    },
                    "stage_2_indic_translation": {
                        "status": "COMPLETED",
                        "source_lang": lang_info["name"],
                        "target_lang": "English (Standard GovTech Schema)",
                        "normalized_output": norm["translated_text"],
                        "summary": norm["summary"]
                    },
                    "stage_3_ner_extraction": {
                        "status": "COMPLETED",
                        "extracted_pincode": entities["pincode"],
                        "extracted_phone": entities["phone"],
                        "extracted_landmark": entities["landmark"],
                        "extracted_location": entities["location_candidate"],
                        "sentiment_polarity": entities["sentiment_score"],
                        "distress_level": entities["sentiment"]
                    },
                    "stage_4_intent_routing": {
                        "status": "COMPLETED",
                        "selected_department": classification["department_name"],
                        "confidence_score": classification["confidence"],
                        "category": classification["category"],
                        "sub_category": classification["sub_category"],
                        "matched_lexicon": classification["matched_keywords"],
                        "designated_officer": classification["nodal_officer"]
                    },
                    "stage_5_sla_and_duplicate_clustering": {
                        "status": "COMPLETED",
                        "calculated_sla_turnaround": f"{ai_engine.calculate_sla_hours(entities['urgency'], classification['default_sla_hours'])} Hours",
                        "duplicate_risk": dup_info["is_duplicate"],
                        "similarity_index": dup_info["similarity_score"],
                        "cluster_parent": dup_info["parent_id"]
                    }
                }

                self._send_json({"success": True, "trace": pipeline_trace})
                return

            # 9. Text-to-Speech (TTS) Endpoint
            if path == "/api/ai/tts":
                text = body.get("text", "").strip()
                lang_code = body.get("lang", "hi")
                voice_id = body.get("voice", None)

                if not text:
                    self._send_json({"success": False, "error": "No text provided for TTS"}, 400)
                    return

                result = ai_engine.synthesize_speech(text, lang_code, voice_id)
                self._send_json({"success": True, "tts": result})
                return

            # 10. Speech-to-Text (STT) Transcription Endpoint
            if path == "/api/ai/transcribe-audio":
                # Accepts { "audio_base64": "...", "lang": "hi" }
                audio_b64 = body.get("audio_base64", "")
                lang_code = body.get("lang", "hi")

                if not audio_b64:
                    self._send_json({"success": False, "error": "No audio_base64 provided"}, 400)
                    return

                result = ai_engine.transcribe_audio_base64(audio_b64, lang_code)
                self._send_json({"success": True, "stt": result})
                return

            self._send_json({"error": "Endpoint not found"}, 404)
        except Exception as e:
            traceback.print_exc()
            self._send_json({"success": False, "error": str(e)}, 500)


def start_server(port=PORT):
    # Initialize DB schema & seed data
    database.init_db()
    
    server_address = ("", port)
    httpd = socketserver.ThreadingTCPServer(server_address, JanSamvaadHandler)
    httpd.allow_reuse_address = True
    print(f"==================================================")
    print(f"   JanSamvaad AI (SIH1516) - Server Running")
    print(f"   URL: http://localhost:{port}")
    print(f"   Database: SQLite initialized")
    print(f"   Frontend: {FRONTEND_DIR}")
    print(f"==================================================")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...")
        httpd.server_close()


if __name__ == "__main__":
    start_server(PORT)

