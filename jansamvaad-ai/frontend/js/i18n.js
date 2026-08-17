/**
 * JanSamvaad AI - Multilingual Localization (i18n) Engine
 * Full UI and Voice dictionary across 12 Indian Languages
 */

const I18N_DATA = {
  en: {
    title: "JanSamvaad AI",
    tagline: "National Multilingual AI Grievance Redressal Platform",
    tab_chat: "AI Voice & Chatbot",
    tab_direct: "Direct Filing",
    tab_track: "Track Grievance",
    tab_officer: "Officer Portal",
    tab_analytics: "GIS & Analytics",
    tab_pipeline: "Bhashini Inspector",
    
    stat_resolved: "Resolved Cases",
    stat_sla: "Average Resolution SLA",
    stat_accuracy: "AI Routing Accuracy",
    stat_states: "28 States & UTs Covered",
    
    chat_welcome: "Namaste! I am JanSamvaad AI, your multilingual civic grievance assistant. Speak or type in your language. How can I help you today?",
    chat_placeholder: "Type your complaint in any Indian language or click the mic to speak...",
    mic_start: "Listening in your language... Speak now",
    mic_stop: "Processing speech with Bhashini STT...",
    btn_send: "Send",
    btn_file: "Confirm & Generate Token",
    
    chip_1: "Water supply pipeline burst in my street",
    chip_2: "Dangerous pothole on main road causing accidents",
    chip_3: "Garbage not collected for 5 days, severe foul smell",
    chip_4: "Streetlight not working, safety risk at night",
    
    slot_dept: "Department",
    slot_category: "Category",
    slot_urgency: "Urgency Level",
    slot_location: "Detected Location",
    slot_pincode: "PIN Code",
    slot_sla: "Target SLA Turnaround",
    
    track_title: "Track Your Grievance Status",
    track_subtitle: "Enter your Token ID (e.g. JAN-2026-78412) or Registered Mobile Number",
    track_placeholder: "Enter Token ID or Mobile (e.g., JAN-2026-78412)",
    track_btn: "Track Now",
    
    escalate_btn: "Escalate to Higher Authority (Nodal Officer)",
    escalate_modal_title: "Escalate Grievance to Tier-2 Authority",
    escalate_reason_placeholder: "Explain why this case needs urgent escalation...",
    
    feedback_title: "Citizen Satisfaction Rating",
    feedback_submit: "Submit Feedback"
  },
  hi: {
    title: "जनसंवाद AI",
    tagline: "राष्ट्रीय बहुभाषी एआई नागरिक शिकायत निवारण मंच",
    tab_chat: "एआई वॉयस व चैटबॉट",
    tab_direct: "सीधी शिकायत",
    tab_track: "शिकायत ट्रैक करें",
    tab_officer: "अधिकारी पोर्टल",
    tab_analytics: "जीआईएस व विश्लेषण",
    tab_pipeline: "भाषिणी पाइपलाइन",
    
    stat_resolved: "सुलझाई गई शिकायतें",
    stat_sla: "औसत समाधान समय",
    stat_accuracy: "एआई वर्गीकरण सटीकता",
    stat_states: "28 राज्य व केंद्र शासित प्रदेश",
    
    chat_welcome: "नमस्ते! मैं जनसंवाद AI हूँ, आपका बहुभाषी शिकायत निवारण सहायक। अपनी भाषा में बोलें या लिखें। मैं आज आपकी क्या सहायता कर सकता हूँ?",
    chat_placeholder: "अपनी शिकायत किसी भी भाषा में लिखें या माइक दबाकर बोलें...",
    mic_start: "आपकी भाषा में सुन रहे हैं... कृपया बोलें",
    mic_stop: "भाषिणी एआई द्वारा आवाज को प्रोसेस किया जा रहा है...",
    btn_send: "भेजें",
    btn_file: "शिकायत पुष्टि करें व टोकन लें",
    
    chip_1: "हमारे इलाके में पानी की पाइपलाइन फटी हुई है",
    chip_2: "सड़क पर गहरा गड्ढा है, दुर्घटना का खतरा है",
    chip_3: "5 दिनों से कचरा नहीं उठाया गया, बदबू आ रही है",
    chip_4: "स्ट्रीट लाइट खराब है, रात में अंधेरा रहता है",
    
    slot_dept: "संबंधित विभाग",
    slot_category: "शिकायत श्रेणी",
    slot_urgency: "तात्कालिकता (Urgency)",
    slot_location: "पहचाना गया क्षेत्र",
    slot_pincode: "पिन कोड",
    slot_sla: "नियत समाधान समय (SLA)",
    
    track_title: "अपनी शिकायत की स्थिति ट्रैक करें",
    track_subtitle: "अपना टोकन नंबर (उदा. JAN-2026-78412) या मोबाइल नंबर दर्ज करें",
    track_placeholder: "टोकन नंबर या मोबाइल दर्ज करें (उदा. JAN-2026-78412)",
    track_btn: "ट्रैक करें",
    
    escalate_btn: "उच्च नोडल अधिकारी को शिकायत अग्रेषित करें (Escalate)",
    escalate_modal_title: "टियर-2 नोडल अधिकारी को शिकायत अग्रेषित करें",
    escalate_reason_placeholder: "शिकायत अग्रेषित करने का कारण बताएं...",
    
    feedback_title: "नागरिक संतुष्टि रेटिंग",
    feedback_submit: "प्रतिक्रिया दर्ज करें"
  },
  ta: {
    title: "ஜன்சம்வாத் AI",
    tagline: "தேசிய பன்மொழி AI குறைதீர்ப்பு தளம்",
    tab_chat: "AI குரல் & சாட்போட்",
    tab_direct: "நேரடி புகார்",
    tab_track: "புகார் நிலை அறிதல்",
    tab_officer: "அதிகாரிகள் தளம்",
    tab_analytics: "ஜிஐஎஸ் & புள்ளிவிவரம்",
    tab_pipeline: "பாஷிணி நுண்ணாய்வு",
    
    stat_resolved: "தீர்க்கப்பட்ட புகார்கள்",
    stat_sla: "சராசரி தீர்வு நேரம்",
    stat_accuracy: "AI துல்லியம்",
    stat_states: "28 மாநிலங்கள் & யூனியன் பிரதேசங்கள்",
    
    chat_welcome: "வணக்கம்! நான் ஜன்சம்வாத் AI. உங்கள் குறைகளை உங்கள் தாய்மொழியில் பேசவோ தட்டச்சு செய்யவோ முடியும். நான் உங்களுக்கு எவ்வாறு உதவலாம்?",
    chat_placeholder: "உங்கள் புகாரை தமிழில் தட்டச்சு செய்யவும் அல்லது மைக் அழுத்தவும்...",
    mic_start: "கேட்கிறது... இப்போது பேசவும்",
    mic_stop: "குரல் பதிவு செயலாக்கப்படுகிறது...",
    btn_send: "அனுப்பு",
    btn_file: "உறுதிசெய்து டோக்கன் பெறவும்",
    
    chip_1: "எங்கள் தெருவில் குடிநீர் குழாய் உடைந்துள்ளது",
    chip_2: "சாலையில் பெரிய குழி உள்ளது விபத்து அபாயம்",
    chip_3: "5 நாட்களாக குப்பை அள்ளப்படவில்லை கடும் துர்நாற்றம்",
    chip_4: "தெரு விளக்கு எரியவில்லை இரவு நேர பாதுகாப்பு குறைவு",
    
    slot_dept: "துறை",
    slot_category: "பிரிவு",
    slot_urgency: "முன்னுரிமை",
    slot_location: "கண்டறியப்பட்ட இடம்",
    slot_pincode: "அஞ்சல் குறியீடு",
    slot_sla: "தீர்வு காலக்கெடு",
    
    track_title: "புகாரின் நிலையை அறியவும்",
    track_subtitle: "உங்கள் டோக்கன் எண் அல்லது மொபைல் எண்ணை உள்ளிடவும்",
    track_placeholder: "டோக்கன் எண் (எ.கா: JAN-2026-91204)",
    track_btn: "நிலையை பார்க்க",
    
    escalate_btn: "உயர் அதிகாரியிடம் மேல்முறையீடு செய்யவும்",
    escalate_modal_title: "நோடல் அதிகாரிக்கு மேல்முறையீடு",
    escalate_reason_placeholder: "மேல்முறையீட்டுக்கான காரணத்தைக் குறிப்பிடவும்...",
    
    feedback_title: "குடிமக்கள் திருப்தி மதிப்பீடு",
    feedback_submit: "கருத்து சமர்ப்பிக்கவும்"
  },
  te: {
    title: "జనసంవాద్ AI",
    tagline: "జాతీయ బహుభాషా ఏఐ ప్రజా ఫిర్యాదుల పరిష్కార వేదిక",
    tab_chat: "AI వాయిస్ & చాట్‌బాట్",
    tab_direct: "నేరుగా ఫిర్యాదు",
    tab_track: "స్టేటస్ ట్రాక్ చేయండి",
    tab_officer: "అధికారుల పోర్టల్",
    tab_analytics: "GIS & విశ్లేషణ",
    tab_pipeline: "భాషిణి ఇన్స్పెక్టర్",
    
    stat_resolved: "పరిష్కరించబడిన కేసులు",
    stat_sla: "సగటు పరిష్కార సమయం",
    stat_accuracy: "ఏఐ వర్గీకరణ ఖచ్చితత్వం",
    stat_states: "28 రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలు",
    
    chat_welcome: "నమస్కారం! నేను జనసంవాద్ AI. మీ ఫిర్యాదులను మీ భాషలోనే మాట్లాడండి లేదా టైప్ చేయండి. నేను మీకు ఎలా సహాయపడగలను?",
    chat_placeholder: "మీ ఫిర్యాదును తెలుగులో టైప్ చేయండి లేదా మైక్ క్లిక్ చేయండి...",
    mic_start: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
    mic_stop: "ప్రాసెస్ అవుతోంది...",
    btn_send: "పంపండి",
    btn_file: "ధృవీకరించి టోకెన్ పొందండి",
    
    chip_1: "మా ప్రాంతంలో తాగునీటి పైప్‌లైన్ పగిలిపోయింది",
    chip_2: "రోడ్డుపై పెద్ద గుంతలు ఉన్నాయి ప్రమాదాలు జరుగుతున్నాయి",
    chip_3: "వారం రోజులుగా చెత్త తీయలేదు విపరీతమైన దుర్వాసన",
    chip_4: "వీధి దీపాలు వెలగడం లేదు రాత్రి చీకటిగా ఉంది",
    
    slot_dept: "శాఖ",
    slot_category: "కేటగిరీ",
    slot_urgency: "ప్రాధాన్యత",
    slot_location: "గుర్తించిన ప్రాంతం",
    slot_pincode: "పిన్ కోడ్",
    slot_sla: "లక్ష్య పరిష్కార సమయం",
    
    track_title: "మీ ఫిర్యాదు స్థితిని ట్రాక్ చేయండి",
    track_subtitle: "మీ టోకెన్ ఐడి లేదా ఫోన్ నంబర్ నమోదు చేయండి",
    track_placeholder: "టోకెన్ ఐడి (ఉదా: JAN-2026-51980)",
    track_btn: "ట్రాక్ చేయండి",
    
    escalate_btn: "ఉన్నతాధికారికి ఎస్కలేట్ చేయండి",
    escalate_modal_title: "నోడల్ అధికారికి ఫిర్యాదు బదిలీ",
    escalate_reason_placeholder: "ఎస్కలేషన్ కారణాన్ని వివరించండి...",
    
    feedback_title: "పౌర సంతృప్తి రేటింగ్",
    feedback_submit: "ఫీడ్‌బ్యాక్ పంపండి"
  },
  bn: {
    title: "জনসংবাদ AI",
    tagline: "জাতীয় বহুভাষিক এআই অভিযোগ প্রতিকার পোর্টাল",
    tab_chat: "এআই ভয়েস ও চ্যাটবট",
    tab_direct: "সরাসরি অভিযোগ",
    tab_track: "অভিযোগ ট্র্যাক করুন",
    tab_officer: "আধিকারিক পোর্টাল",
    tab_analytics: "জিআইএস ও ডেটা",
    tab_pipeline: "ভাষিণী পাইপলাইন",
    
    stat_resolved: "সমাধানকৃত অভিযোগ",
    stat_sla: "গড় সমাধান সময়",
    stat_accuracy: "এআই নির্ভুলতা",
    stat_states: "২৮টি রাজ্য ও কেন্দ্রশাসিত অঞ্চল",
    
    chat_welcome: "নমস্কার! আমি জনসংবাদ AI। আপনার নিজের ভাষায় অভিযোগ জানান বা টাইপ করুন। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    chat_placeholder: "বাংলায় আপনার অভিযোগ লিখুন অথবা মাইকে কথা বলুন...",
    mic_start: "শুনছি... অনুগ্রহ করে কথা বলুন",
    mic_stop: "ভাষিণী এআই দিয়ে ভয়েস প্রসেস হচ্ছে...",
    btn_send: "পাঠান",
    btn_file: "নিশ্চিত করুন ও টোকেন নিন",
    
    chip_1: "আমাদের পাড়ায় পানীয় জলের পাইপ ফেটে গেছে",
    chip_2: "রাস্তায় বড় গর্তের কারণে দুর্ঘটনা ঘটছে",
    chip_3: "৫ দিন ধরে আবর্জনা পরিষ্কার করা হয়নি তীব্র দুর্গন্ধ",
    chip_4: "রাস্তার আলো জ্বলছে না রাতে চলাচলে সমস্যা",
    
    slot_dept: "দপ্তর",
    slot_category: "বিভাগ",
    slot_urgency: "জরুরি স্তর",
    slot_location: "চিহ্নিত এলাকা",
    slot_pincode: "পিন কোড",
    slot_sla: "সমাধানের সময়সীমা",
    
    track_title: "অভিযোগের স্থিতি ট্র্যাক করুন",
    track_subtitle: "আপনার টোকেন আইডি অথবা মোবাইল নম্বর দিন",
    track_placeholder: "টোকেন আইডি (যেমন: JAN-2026-64501)",
    track_btn: "ট্র্যাক করুন",
    
    escalate_btn: "উচ্চপদস্থ আধিকারিকের কাছে পাঠান (Escalate)",
    escalate_modal_title: "উচ্চ আধিকারিকের কাছে আবেদন",
    escalate_reason_placeholder: "আবেদনের কারণ লিখুন...",
    
    feedback_title: "নাগরিক সন্তুষ্টি রেটিং",
    feedback_submit: "মতামত জমা দিন"
  },
  mr: {
    title: "जनसंवाद AI",
    tagline: "राष्ट्रीय बहुभाषिक तक्रार निवारण व्यासपीठ",
    tab_chat: "AI व्हॉइस व चॅटबॉट",
    tab_direct: "थेट तक्रार",
    tab_track: "तक्रार ट्रॅक करा",
    tab_officer: "अधिकारी पोर्टल",
    tab_analytics: "जीआयएस व विश्लेषण",
    tab_pipeline: "भाषिणी पाइपलाइन",
    
    stat_resolved: "निवारण झालेल्या तक्रारी",
    stat_sla: "सरासरी निवारण वेळ",
    stat_accuracy: "AI अचूकता",
    stat_states: "28 राज्ये आणि केंद्रशासित प्रदेश",
    
    chat_welcome: "नमस्कार! मी जनसंवाद AI आहे. आपल्या मातृभाषेत बोला किंवा लिहा. मी आपली काय मदत करू शकतो?",
    chat_placeholder: "आपली तक्रार मराठीत लिहा किंवा माइक दाबा...",
    mic_start: "ऐकत आहे... आता बोला",
    mic_stop: "आवाज प्रक्रिया सुरू आहे...",
    btn_send: "पाठवा",
    btn_file: "तक्रार नोंदवा व टोकन घ्या",
    
    chip_1: "आमच्या भागात पिण्याच्या पाण्याची पाइपलाइन फुटली आहे",
    chip_2: "रस्त्यावर मोठा खड्डा पडला असून अपघाताचा धोका आहे",
    chip_3: "कचरा उचलला गेला नाही आणि घाण वास येत आहे",
    chip_4: "स्ट्रीट लाईट बंद असल्याने रात्री अंधार असतो",
    
    slot_dept: "विभाग",
    slot_category: "श्रेणी",
    slot_urgency: "तातडीची पातळी",
    slot_location: "शोधलेले ठिकाण",
    slot_pincode: "पिन कोड",
    slot_sla: "अपेक्षित निवारण वेळ",
    
    track_title: "तक्रारीची स्थिती तपासा",
    track_subtitle: "आपला टोकन क्रमांक किंवा मोबाईल नंबर टाका",
    track_placeholder: "टोकन क्रमांक (उदा: JAN-2026-78412)",
    track_btn: "तपासा",
    
    escalate_btn: "वरिष्ठ अधिकाऱ्यांकडे तक्रार वर्ग करा",
    escalate_modal_title: "वरिष्ठ नोडल अधिकाऱ्यांकडे पाठवा",
    escalate_reason_placeholder: "तक्रार वर्ग करण्याचे कारण सांगा...",
    
    feedback_title: "नागरिक समाधान रेटिंग",
    feedback_submit: "प्रतिक्रिया नोंदवा"
  },
  gu: {
    title: "જનસંવાદ AI",
    tagline: "રાષ્ટ્રીય બહુભાષી નાગરિક ફરિયાદ નિવારણ મંચ",
    tab_chat: "AI વૉઇસ અને ચેટબોટ",
    tab_direct: "સીધી ફરિયાદ",
    tab_track: "ફરિયાદ ટ્રેક કરો",
    tab_officer: "અધિકારી પોર્ટલ",
    tab_analytics: "GIS અને વિશ્લેષણ",
    tab_pipeline: "ભાષિણી ઇન્સ્પેક્ટર",
    
    stat_resolved: "ઉકેલાયેલી ફરિયાદો",
    stat_sla: "સરેરાશ ઉકેલ સમય",
    stat_accuracy: "AI ચોકસાઈ",
    stat_states: "28 રાજ્યો અને કેન્દ્રશાસિત પ્રદેશો",
    
    chat_welcome: "નમસ્તે! હું જનસંવાદ AI છું. તમારી ભાષામાં બોલો અથવા ટાઈપ કરો. હું તમને કેવી રીતે મદદ કરી શકું?",
    chat_placeholder: "તમારી ફરિયાદ ગુજરાતીમાં લખો અથવા માઇક દબાવો...",
    mic_start: "સાંભળી રહ્યું છે... હવે બોલો",
    mic_stop: "પ્રોસેસિંગ...",
    btn_send: "મોકલો",
    btn_file: "ટોકન મેળવો",
    
    chip_1: "અમારી સોસાયટીમાં પીવાના પાણીની પાઇપલાઇન તૂટી છે",
    chip_2: "રસ્તા પર મોટા ખાડા પડ્યા છે અકસ્માતનો ભય છે",
    chip_3: "કચરો ઉપાડવામાં આવ્યો નથી અને દુર્ગંધ આવી રહી છે",
    chip_4: "ટ્રાન્સફોર્મર સ્પાર્ક થઈ રહ્યું છે અને વાયરિંગ ખુલ્લું છે",
    
    slot_dept: "વિભાગ",
    slot_category: "શ્રેણી",
    slot_urgency: "તાકીદ સ્તર",
    slot_location: "વિસ્તાર",
    slot_pincode: "પીન કોડ",
    slot_sla: "ઉકેલ સમય",
    
    track_title: "ફરિયાદનું સ્ટેટસ ટ્રેક કરો",
    track_subtitle: "ટોકન નંબર અથવા મોબાઈલ દાખલ કરો",
    track_placeholder: "ટોકન નંબર (દા.ત. JAN-2026-83199)",
    track_btn: "ટ્રેક કરો",
    
    escalate_btn: "ઉચ્ચ અધિકારીને મોકલો",
    escalate_modal_title: "નોડલ અધિકારીને ફરિયાદ",
    escalate_reason_placeholder: "કારણ જણાવો...",
    
    feedback_title: "નાગરિક પ્રતિસાદ",
    feedback_submit: "સબમિટ કરો"
  },
  kn: {
    title: "ಜನಸಂವಾದ AI",
    tagline: "ರಾಷ್ಟ್ರೀಯ ಬಹುಭಾಷಾ ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ವೇದಿಕೆ",
    tab_chat: "AI ಧ್ವನಿ & ಚಾಟ್‌ಬಾಟ್",
    tab_direct: "ನೇರ ದೂರು",
    tab_track: "ದೂರು ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
    tab_officer: "ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್",
    tab_analytics: "ಜಿಐಎಸ್ ವಿಶ್ಲೇಷಣೆ",
    tab_pipeline: "ಭಾಷಿಣಿ ಪೈಪ್‌ಲೈನ್",
    
    stat_resolved: "ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು",
    stat_sla: "ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ",
    stat_accuracy: "AI ನಿಖರತೆ",
    stat_states: "28 ರಾಜ್ಯಗಳು",
    
    chat_welcome: "ನಮಸ್ಕಾರ! ನಾನು ಜನಸಂವಾದ AI. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    chat_placeholder: "ನಿಮ್ಮ ದೂರನ್ನು ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಬಳಸಿ...",
    mic_start: "ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ",
    mic_stop: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    btn_send: "ಕಳುಹಿಸಿ",
    btn_file: "ಟೋಕನ್ ಪಡೆಯಿರಿ",
    
    chip_1: "ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ಹೋಗಿದೆ",
    chip_2: "ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ",
    chip_3: "ಕಸ ವಿಲೇವಾರಿ ಮಾಡಿಲ್ಲ ದುರ್ನಾತ ಬರುತ್ತಿದೆ",
    chip_4: "ಬೀದಿ ದೀಪಗಳು ಉರಿಯುತ್ತಿಲ್ಲ",
    
    slot_dept: "ಇಲಾಖೆ",
    slot_category: "ವರ್ಗ",
    slot_urgency: "ತುರ್ತು ಮಟ್ಟ",
    slot_location: "ಸ್ಥಳ",
    slot_pincode: "ಪಿನ್ ಕೋಡ್",
    slot_sla: "ಪರಿಹಾರ ಸಮಯ",
    
    track_title: "ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    track_subtitle: "ಟೋಕನ್ ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ನಂಬರ್ ನಮೂದಿಸಿ",
    track_placeholder: "ಟೋಕನ್ ಐಡಿ",
    track_btn: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    
    escalate_btn: "ಉನ್ನತ ಅಧಿಕಾರಿಗೆ ವರ್ಗಾಯಿಸಿ",
    escalate_modal_title: "ಅಧಿಕಾರಿಗೆ ಎಸ್ಕಲೇಟ್ ಮಾಡಿ",
    escalate_reason_placeholder: "ಕಾರಣ ತಿಳಿಸಿ...",
    
    feedback_title: "ಪ್ರತಿಕ್ರಿಯೆ ರೇಟಿಂಗ್",
    feedback_submit: "ಸಲ್ಲಿಸಿ"
  },
  ml: {
    title: "ജൻസംവാദ് AI",
    tagline: "ദേശീയ ബഹുഭാഷാ പരാതി പരിഹാര പ്ലാറ്റ്ഫോം",
    tab_chat: "AI വോയ്‌സ് & ചാറ്റ്ബോട്ട്",
    tab_direct: "നേരിട്ടുള്ള പരാതി",
    tab_track: "പരാതി ട്രാക്ക് ചെയ്യുക",
    tab_officer: "ഓഫീസർ പോർട്ടൽ",
    tab_analytics: "GIS അനലിറ്റിക്സ്",
    tab_pipeline: "ഭാഷിണി ഇൻസ്പെക്ടർ",
    
    stat_resolved: "പരിഹരിച്ച പരാതികൾ",
    stat_sla: "ശരാശരി പരിഹാര സമയം",
    stat_accuracy: "AI കൃത്യത",
    stat_states: "28 സംസ്ഥാനങ്ങൾ",
    
    chat_welcome: "നമസ്കാരം! ഞാൻ ജൻസംവാദ് AI. നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യുക. ഞാൻ എങ്ങനെ സഹായിക്കണം?",
    chat_placeholder: "മലയാളത്തിൽ പരാതി രേഖപ്പെടുത്തുക...",
    mic_start: "കേൾക്കുന്നു... സംസാരിക്കുക",
    mic_stop: "പ്രോസസ്സ് ചെയ്യുന്നു...",
    btn_send: "അയക്കുക",
    btn_file: "ടോക്കൺ നേടുക",
    
    chip_1: "കുടിവെള്ള പൈപ്പ് പൊട്ടി വെള്ളം പാഴാകുന്നു",
    chip_2: "റോഡിൽ വലിയ കുഴികൾ അപകടം ഉണ്ടാക്കുന്നു",
    chip_3: "മാലിന്യം നീക്കം ചെയ്തിട്ടില്ല ദുർഗന്ധം വമിക്കുന്നു",
    chip_4: "തെരുവ് വിളക്കുകൾ കത്തുന്നില്ല",
    
    slot_dept: "വകുപ്പ്",
    slot_category: "വിഭാഗം",
    slot_urgency: "മുൻഗണന",
    slot_location: "സ്ഥലം",
    slot_pincode: "പിൻ കോഡ്",
    slot_sla: "പരിഹാര കാലാവധി",
    
    track_title: "പരാതിയുടെ സ്ഥിതി അറിയുക",
    track_subtitle: "ടോക്കൺ നമ്പർ നൽകുക",
    track_placeholder: "ടോക്കൺ നമ്പർ",
    track_btn: "ട്രാക്ക് ചെയ്യുക",
    
    escalate_btn: "ഉന്നതാധികാരിക്ക് കൈമാറുക",
    escalate_modal_title: "നോഡൽ ഓഫീസർക്ക് പരാതി",
    escalate_reason_placeholder: "കാരണം വ്യക്തമാക്കുക...",
    
    feedback_title: "റേറ്റിംഗ് നൽകുക",
    feedback_submit: "സമർപ്പിക്കുക"
  },
  pa: {
    title: "ਜਨਸੰਵਾਦ AI",
    tagline: "ਰਾਸ਼ਟਰੀ ਬਹੁ-ਭਾਸ਼ਾਈ ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਪੋਰਟਲ",
    tab_chat: "AI ਵੌਇਸ ਤੇ ਚੈਟਬੋਟ",
    tab_direct: "ਸਿੱਧੀ ਸ਼ਿਕਾਇਤ",
    tab_track: "ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ",
    tab_officer: "ਅਧਿਕਾਰੀ ਪੋਰਟਲ",
    tab_analytics: "GIS ਤੇ ਵਿਸ਼ਲੇਸ਼ਣ",
    tab_pipeline: "ਭਾਸ਼ਿਣੀ ਜਾਂਚ",
    
    stat_resolved: "ਹੱਲ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ",
    stat_sla: "ਔਸਤ ਹੱਲ ਸਮਾਂ",
    stat_accuracy: "AI ਸ਼ੁੱਧਤਾ",
    stat_states: "28 ਰਾਜ",
    
    chat_welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਜਨਸੰਵਾਦ AI ਹਾਂ। ਆਪਣੀ ਮਾਤ-ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਲਿਖੋ। ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    chat_placeholder: "ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾਓ...",
    mic_start: "ਸੁਣ ਰਿਹਾ ਹੈ... ਹੁਣ ਬੋਲੋ",
    mic_stop: "ਪ੍ਰੋਸੈਸਿੰਗ...",
    btn_send: "ਭੇਜੋ",
    btn_file: "ਟੋਕਨ ਪ੍ਰਾਪਤ ਕਰੋ",
    
    chip_1: "ਸਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਪਾਣੀ ਦੀ ਪਾਈਪਲਾਈਨ ਟੁੱਟੀ ਹੋਈ ਹੈ",
    chip_2: "ਸੜਕ 'ਤੇ ਵੱਡੇ ਟੋਏ ਹਨ ਹਾਦਸੇ ਦਾ ਡਰ ਹੈ",
    chip_3: "ਕੂੜਾ ਨਹੀਂ ਚੁੱਕਿਆ ਗਿਆ ਅਤੇ ਬਦਬੂ ਆ ਰਹੀ ਹੈ",
    chip_4: "ਪ੍ਰਾਇਮਰੀ ਹੈਲਥ ਸੈਂਟਰ ਵਿੱਚ ਦਵਾਈਆਂ ਖਤਮ ਹਨ",
    
    slot_dept: "ਵਿਭਾਗ",
    slot_category: "ਸ਼੍ਰੇਣੀ",
    slot_urgency: "ਜ਼ਰੂਰੀ ਪੱਧਰ",
    slot_location: "ਇਲਾਕਾ",
    slot_pincode: "ਪਿੰਨ ਕੋਡ",
    slot_sla: "ਹੱਲ ਸਮਾਂ",
    
    track_title: "ਸ਼ਿਕਾਇਤ ਦੀ ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    track_subtitle: "ਟੋਕਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    track_placeholder: "ਟੋਕਨ ਨੰਬਰ (ਜਿਵੇਂ: JAN-2026-30219)",
    track_btn: "ਟ੍ਰੈਕ ਕਰੋ",
    
    escalate_btn: "ਉੱਚ ਅਧਿਕਾਰੀ ਕੋਲ ਅੱਗੇ ਭੇਜੋ",
    escalate_modal_title: "ਨੋਡਲ ਅਧਿਕਾਰੀ ਨੂੰ ਅਪੀਲ",
    escalate_reason_placeholder: "ਕਾਰਨ ਦੱਸੋ...",
    
    feedback_title: "ਨਾਗਰਿਕ ਫੀਡਬੈਕ",
    feedback_submit: "ਦਰਜ ਕਰੋ"
  },
  or: {
    title: "ଜନସମ୍ବାଦ AI",
    tagline: "ଜାତୀୟ ବହୁଭାଷୀ ନାଗରିକ ଅଭିଯୋଗ ନିବାରଣ ପୋର୍ଟାଲ",
    tab_chat: "AI ଭଏସ୍ ଓ ଚାଟବଟ୍",
    tab_direct: "ସିଧାସଳଖ ଅଭିଯୋଗ",
    tab_track: "ଅଭିଯୋଗ ଟ୍ରାକ୍ କରନ୍ତୁ",
    tab_officer: "ଅଧିକାରୀ ପୋର୍ଟାଲ",
    tab_analytics: "GIS ଓ ତଥ୍ୟ",
    tab_pipeline: "ଭାଷିଣୀ ଇନ୍ସପେକ୍ଟର",
    
    stat_resolved: "ସମାଧାନ ହୋଇଥିବା ଅଭିଯୋଗ",
    stat_sla: "ହାରାହାରି ସମାଧାନ ସମୟ",
    stat_accuracy: "AI ସଠିକତା",
    stat_states: "୨୮ ରାଜ୍ୟ",
    
    chat_welcome: "ନମସ୍କାର! ମୁଁ ଜନସମ୍ବାଦ AI। ଆପଣଙ୍କ ଭାଷାରେ କୁହନ୍ତୁ କିମ୍ବା ଟାଇପ୍ କରନ୍ତୁ।",
    chat_placeholder: "ଓଡ଼ିଆରେ ଅଭିଯୋଗ ଲେଖନ୍ତୁ...",
    mic_start: "ଶୁଣୁଛି... କୁହନ୍ତୁ",
    mic_stop: "ପ୍ରୋସେସିଂ...",
    btn_send: "ପଠାନ୍ତୁ",
    btn_file: "ଟୋକନ୍ ପାଆନ୍ତୁ",
    
    chip_1: "ଆମ ଅଞ୍ଚଳରେ ପାନୀୟ ଜଳ ପାଇପ୍ ଫାଟିଯାଇଛି",
    chip_2: "ରାସ୍ତାରେ ବଡ଼ ଖାଲ ହୋଇ ଦୁର୍ଘଟଣା ଘଟୁଛି",
    chip_3: "ଆବର୍ଜନା ସଫା ହୋଇନାହିଁ ଦୁର୍ଗନ୍ଧ ହେଉଛି",
    chip_4: "ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍ ଜଳୁନାହିଁ",
    
    slot_dept: "ବିଭାଗ",
    slot_category: "ବର୍ଗ",
    slot_urgency: "ଜରୁରୀ ସ୍ତର",
    slot_location: "ସ୍ଥାନ",
    slot_pincode: "ପିନ୍ କୋଡ୍",
    slot_sla: "ସମାଧାନ ସମୟ",
    
    track_title: "ଅଭିଯୋଗର ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ",
    track_subtitle: "ଟୋକନ୍ ନମ୍ବର ଦିଅନ୍ତୁ",
    track_placeholder: "ଟୋକନ୍ ନମ୍ବର",
    track_btn: "ଯାଞ୍ଚ କରନ୍ତୁ",
    
    escalate_btn: "ଉଚ୍ଚ ଅଧିକାରୀଙ୍କ ନିକଟକୁ ପଠାନ୍ତୁ",
    escalate_modal_title: "ନୋଡାଲ ଅଧିକାରୀଙ୍କୁ ଆବେଦନ",
    escalate_reason_placeholder: "କାରଣ ଲେଖନ୍ତୁ...",
    
    feedback_title: "ନାଗରିକ ମତାମତ",
    feedback_submit: "ଦାଖଲ କରନ୍ତୁ"
  },
  hinglish: {
    title: "JanSamvaad AI",
    tagline: "Desh Ka Smart Multilingual Grievance Portal",
    tab_chat: "AI Voice & Chatbot",
    tab_direct: "Direct Filing",
    tab_track: "Track Grievance",
    tab_officer: "Officer Portal",
    tab_analytics: "GIS & Analytics",
    tab_pipeline: "Bhashini Inspector",
    
    stat_resolved: "Resolved Complaints",
    stat_sla: "Avg Resolution Time",
    stat_accuracy: "AI Classification Rate",
    stat_states: "28 States & UTs",
    
    chat_welcome: "Namaste! Main hoon JanSamvaad AI. Aap apni bhasha ya Hinglish mein complaint bol ya type kar sakte hain. Bataiye aaj kya problem hai?",
    chat_placeholder: "Apni complaint type karein ya mic daba kar bolein...",
    mic_start: "Sun rahe hain... please boliye",
    mic_stop: "Bhashini AI se audio process ho raha hai...",
    btn_send: "Send",
    btn_file: "Confirm & Generate Token",
    
    chip_1: "Humare area mein 3 din se paani nahi aa raha",
    chip_2: "Sadak par bada gaddha hai accident ka darr hai",
    chip_3: "Kachra nahi utha hai bohot smell aa rahi hai",
    chip_4: "Streetlight kharab hai raat ko andhera rehta hai",
    
    slot_dept: "Department",
    slot_category: "Category",
    slot_urgency: "Urgency Level",
    slot_location: "Detected Area",
    slot_pincode: "PIN Code",
    slot_sla: "Target SLA Time",
    
    track_title: "Track Your Grievance",
    track_subtitle: "Token ID ya registered mobile number daalein",
    track_placeholder: "Token ID (e.g. JAN-2026-78412)",
    track_btn: "Track Status",
    
    escalate_btn: "Senior Officer ko Escalate Karein",
    escalate_modal_title: "Tier-2 Officer ko Escalation",
    escalate_reason_placeholder: "Escalation ki wajah batayein...",
    
    feedback_title: "Citizen Feedback Rating",
    feedback_submit: "Submit Feedback"
  }
};

let currentLanguage = "en";

function setAppLanguage(langCode) {
  if (!I18N_DATA[langCode]) langCode = "en";
  currentLanguage = langCode;
  const dict = I18N_DATA[langCode];

  // Update elements with data-i18n attributes
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    if (dict[key]) {
      if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
        elem.placeholder = dict[key];
      } else {
        elem.textContent = dict[key];
      }
    }
  });

  // Trigger language change event
  window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: langCode, dict: dict } }));
}

function getI18nString(key, defaultVal = "") {
  const dict = I18N_DATA[currentLanguage] || I18N_DATA["en"];
  return dict[key] || defaultVal || key;
}
