/**
 * JanSamvaad AI - Citizen Chatbot & Conversational Grievance Ingestion
 */

let chatHistory = [];
let currentExtractedData = null;
let uploadedPhotoUrl = null;
window.currentExtractedData = currentExtractedData;

document.addEventListener("DOMContentLoaded", () => {
  initChatView();
});

document.addEventListener("geoLocationUpdated", (e) => {
  const geo = (e && e.detail) || window.currentGeoLocation;
  if (geo) {
    const locElem = document.getElementById("slot-loc-val");
    const pinElem = document.getElementById("slot-pincode-val");
    if (locElem && (!currentExtractedData || !currentExtractedData.landmark || currentExtractedData.landmark.includes("causing"))) {
      locElem.textContent = geo.locality || geo.city || geo.address || "Detected Location";
    }
    if (pinElem && (!currentExtractedData || !currentExtractedData.pincode || currentExtractedData.pincode === "110001")) {
      pinElem.textContent = geo.pincode || "Auto-detected";
    }
  }
  applyCurrentGeoToExtractedData();
  if (currentExtractedData) {
    updateSlotInspector(currentExtractedData);
  }
});

function initChatView() {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const micBtn = document.getElementById("mic-btn");
  const attachBtn = document.getElementById("attach-btn");
  const photoInput = document.getElementById("photo-input");
  const fileTicketBtn = document.getElementById("btn-file-ticket");
  const promptChips = document.querySelectorAll(".prompt-chip");

  // If geolocation already available, show it immediately in the side panel
  if (window.currentGeoLocation) {
    const locElem = document.getElementById("slot-loc-val");
    const pinElem = document.getElementById("slot-pincode-val");
    if (locElem && window.currentGeoLocation.city) {
      locElem.textContent = window.currentGeoLocation.locality || window.currentGeoLocation.city || window.currentGeoLocation.address;
    }
    if (pinElem && window.currentGeoLocation.pincode) {
      pinElem.textContent = window.currentGeoLocation.pincode;
    }
  }

  // Welcome message
  addChatMessage("bot", getI18nString("chat_welcome"), "English");

  // Prompt chips
  promptChips.forEach(chip => {
    chip.addEventListener("click", () => {
      chatInput.value = chip.textContent.trim();
      handleSendMessage();
    });
  });

  // Chat submit
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSendMessage();
    });
  }

  // Voice recording toggle
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      window.voiceEngine.toggleRecording(
        (transcript, isFinal) => {
          chatInput.value = transcript;
          if (isFinal) {
            setTimeout(() => handleSendMessage(), 600);
          }
        },
        () => {
          console.log("Speech input finished");
        }
      );
    });
  }

  // Photo attachment upload
  if (attachBtn && photoInput) {
    attachBtn.addEventListener("click", () => photoInput.click());
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadedPhotoUrl = ev.target.result;
          displayImageAttachmentPreview(uploadedPhotoUrl, file.name);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Confirm and File Ticket button
  if (fileTicketBtn) {
    fileTicketBtn.addEventListener("click", () => {
      submitGrievanceFromSlotData();
    });
  }
}

async function handleSendMessage() {
  const inputElem = document.getElementById("chat-input");
  const text = inputElem.value.trim();
  if (!text) return;

  // Add user bubble
  addChatMessage("user", text, currentLanguage, uploadedPhotoUrl);
  inputElem.value = "";
  const attachedPhoto = uploadedPhotoUrl;
  uploadedPhotoUrl = null;
  clearAttachmentPreview();

  // Show typing indicator
  const typingId = showTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        preferred_language: currentLanguage,
        history: chatHistory,
        attachment_url: attachedPhoto,
        browser_location: window.currentGeoLocation || null
      })
    });

    const data = await response.json();
    removeTypingIndicator(typingId);

    if (data.success) {
      chatHistory.push({ role: "user", content: text });
      chatHistory.push({ role: "bot", content: data.reply });

      addChatMessage("bot", data.reply, data.extracted_data.language);
      
      // Auto voice read aloud
      if (document.getElementById("voice-auto-read")?.checked) {
        window.voiceEngine.speak(data.reply, currentLanguage);
      }

      currentExtractedData = data.extracted_data;
      window.currentExtractedData = currentExtractedData;
      applyCurrentGeoToExtractedData();
      updateSlotInspector(currentExtractedData);
      if (attachedPhoto) {
        currentExtractedData.attachment_url = attachedPhoto;
      }
    } else {
      addChatMessage("bot", "I am having trouble processing that right now. Please try again or fill the Direct Form.", "English");
    }
  } catch (err) {
    console.error("Chat error:", err);
    removeTypingIndicator(typingId);
    addChatMessage("bot", "Network connection error. Please ensure server is running on localhost:8000.", "English");
  }
}

function applyCurrentGeoToExtractedData() {
  if (!currentExtractedData) return;
  
  const geo = window.currentGeoLocation;
  if (!geo) return;

  if (geo.latitude) currentExtractedData.latitude = geo.latitude;
  if (geo.longitude) currentExtractedData.longitude = geo.longitude;

  const currentAddr = (currentExtractedData.address || "").toLowerCase();
  const isGenericAddress = !currentExtractedData.address ||
    currentAddr === "civic ward" ||
    currentAddr === "your specified locality" ||
    currentAddr === "detected area" ||
    currentAddr.includes("causing") ||
    currentAddr.includes("pothole") ||
    currentAddr.includes("accident") ||
    currentAddr.includes("burst") ||
    currentAddr.includes("problem") ||
    currentAddr === "road" ||
    currentAddr === "street";

  if (isGenericAddress && geo.address) {
    currentExtractedData.address = geo.address;
  }

  // Update PIN if not specifically extracted from text
  const currentPin = (currentExtractedData.pincode || "").trim();
  if ((!currentPin || currentPin === "110001" || currentPin === "Detected Area") && geo.pincode) {
    currentExtractedData.pincode = geo.pincode;
  }

  if (geo.city && (!currentExtractedData.city || currentExtractedData.city === "Delhi")) {
    currentExtractedData.city = geo.city;
  }
  if (geo.state && (!currentExtractedData.state || currentExtractedData.state === "Delhi")) {
    currentExtractedData.state = geo.state;
  }
  if (geo.locality && (!currentExtractedData.landmark || currentExtractedData.landmark.toLowerCase().includes("causing"))) {
    currentExtractedData.landmark = geo.locality;
  }

  window.currentExtractedData = currentExtractedData;
}

function addChatMessage(sender, text, langName = "English", imagePreview = null) {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender === "user" ? "user-message" : "bot-message"}`;
  
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Format markdown bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\n/g, '<br>');

  let imgHtml = "";
  if (imagePreview) {
    imgHtml = `
      <div style="margin-top:8px; border-radius:8px; overflow:hidden; border:1px solid rgba(0,0,0,0.1); max-width:240px;">
        <img src="${imagePreview}" style="width:100%; height:auto; display:block;" alt="Grievance Proof" />
        <div style="background:rgba(0,0,0,0.6); color:white; font-size:10px; padding:3px 6px;">[AI Vision Tagged]</div>
      </div>
    `;
  }

  let voiceBtnHtml = "";
  if (sender === "bot") {
    voiceBtnHtml = `
      <button class="voice-playback-btn" onclick="window.voiceEngine.speak(\`${text.replace(/["`]/g, '')}\`, '${currentLanguage}')">
        <span class="material-symbols-outlined" style="font-size:16px;">volume_up</span> Read Aloud
      </button>
    `;
  }

  bubble.innerHTML = `
    <div>${formatted}</div>
    ${imgHtml}
    ${voiceBtnHtml}
    <div class="bubble-meta">
      <span>${sender === "user" ? "Citizen" : "JanSamvaad AI"} • ${langName || "Indic"}</span>
      <span>${now}</span>
    </div>
  `;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById("chat-messages-container");
  const id = "typing-" + Date.now();
  const indicator = document.createElement("div");
  indicator.id = id;
  indicator.className = "chat-bubble bot-message";
  indicator.style.width = "80px";
  indicator.innerHTML = `
    <div style="display:flex; gap:4px; align-items:center; justify-content:center; padding:4px 0;">
      <span style="width:6px; height:6px; background:#3b82f6; border-radius:50%; animation: pulseRecording 0.8s infinite;"></span>
      <span style="width:6px; height:6px; background:#3b82f6; border-radius:50%; animation: pulseRecording 0.8s infinite 0.2s;"></span>
      <span style="width:6px; height:6px; background:#3b82f6; border-radius:50%; animation: pulseRecording 0.8s infinite 0.4s;"></span>
    </div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const elem = document.getElementById(id);
  if (elem) elem.remove();
}

function updateSlotInspector(data) {
  if (!data) return;

  document.getElementById("slot-dept-val").textContent = data.department_short_name || "General Civic";
  document.getElementById("slot-cat-val").textContent = data.category || "Municipal Service";
  
  const urgencyElem = document.getElementById("slot-urgency-val");
  urgencyElem.textContent = data.urgency || "Medium";
  urgencyElem.className = `urgency-pill ${data.urgency || "Medium"}`;

  document.getElementById("slot-loc-val").textContent = data.landmark || data.address || "Identified Sector";
  document.getElementById("slot-pincode-val").textContent = data.pincode || (data.latitude && data.longitude ? "PIN lookup pending..." : "Not detected");
  document.getElementById("slot-sla-val").textContent = `${data.sla_hours || 48} Hours`;
  document.getElementById("slot-officer-val").textContent = data.assigned_officer || "Executive Nodal Officer";

  const btn = document.getElementById("btn-file-ticket");
  if (btn) btn.disabled = false;
}

async function submitGrievanceFromSlotData() {
  if (!currentExtractedData) {
    alert("Please type or speak your grievance first.");
    return;
  }

  const citizenName = document.getElementById("citizen-name-input")?.value || "Citizen of India";
  const citizenPhone = document.getElementById("citizen-phone-input")?.value || "+91 98112 34567";

  const payload = {
    ...currentExtractedData,
    latitude: window.currentGeoLocation?.latitude ?? currentExtractedData.latitude,
    longitude: window.currentGeoLocation?.longitude ?? currentExtractedData.longitude,
    citizen_name: citizenName,
    citizen_phone: citizenPhone,
    channel: "JanSamvaad AI Multilingual Voice/Chat Bot"
  };

  try {
    const res = await fetch("/api/grievance/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonBody(payload)
    });

    const result = await res.json();
    if (result.success && result.grievance) {
      showReceiptModal(result.grievance);
    } else {
      alert("Error filing grievance: " + (result.error || "Unknown"));
    }
  } catch (err) {
    console.error("Filing error:", err);
    alert("Could not connect to server to submit grievance.");
  }
}

function displayImageAttachmentPreview(url, filename) {
  const previewBox = document.getElementById("attachment-preview-box");
  if (!previewBox) return;

  previewBox.style.display = "flex";
  previewBox.innerHTML = `
    <div style="position:relative; display:inline-block;">
      <img src="${url}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1;" />
      <button onclick="clearAttachmentPreview()" style="position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; border:none; border-radius:50%; width:18px; height:18px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>
    </div>
    <div style="font-size:12px; display:flex; flex-direction:column; justify-content:center;">
      <span style="font-weight:600;">${filename}</span>
      <span style="color:#059669; font-size:11px;">✓ AI Geo-Vision Attached</span>
    </div>
  `;
}

function clearAttachmentPreview() {
  const previewBox = document.getElementById("attachment-preview-box");
  if (previewBox) {
    previewBox.style.display = "none";
    previewBox.innerHTML = "";
  }
  uploadedPhotoUrl = null;
}

function showReceiptModal(grievance) {
  const modal = document.getElementById("receipt-modal");
  if (!modal) return;

  document.getElementById("receipt-token-id").textContent = grievance.id;
  document.getElementById("receipt-dept").textContent = grievance.department_name;
  document.getElementById("receipt-category").textContent = grievance.category;
  document.getElementById("receipt-location").textContent = grievance.address || `${grievance.city}, ${grievance.pincode}`;
  document.getElementById("receipt-sla").textContent = grievance.estimated_resolution_time;
  document.getElementById("receipt-officer").textContent = `${grievance.assigned_officer} (${grievance.assigned_officer_contact})`;
  document.getElementById("receipt-sms-preview").textContent = `Govt of India JanSamvaad Alert: Grievance Token ${grievance.id} registered for ${grievance.category}. Assigned to ${grievance.assigned_officer}. Expected resolution by ${grievance.estimated_resolution_time}. Track at jansamvaad.gov.in`;

  modal.classList.add("active");
}

function closeReceiptModal() {
  const modal = document.getElementById("receipt-modal");
  if (modal) modal.classList.remove("active");
}

function jsonBody(obj) {
  return JSON.stringify(obj);
}
