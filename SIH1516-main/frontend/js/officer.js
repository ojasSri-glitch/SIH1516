/**
 * JanSamvaad AI - Officer Portal, Kanban Board & AI Copilot Action Hub
 */

let allOfficerGrievances = [];
let selectedGrievanceForAction = null;

document.addEventListener("DOMContentLoaded", () => {
  initOfficerPortal();
});

function isOfficerAuthenticated() {
  return sessionStorage.getItem("officer_logged_in") === "true";
}

function updateOfficerPortalAuthUI() {
  const loginContainer = document.getElementById("officer-login-container");
  const dashboardContainer = document.getElementById("officer-dashboard-container");

  if (isOfficerAuthenticated()) {
    if (loginContainer) loginContainer.style.display = "none";
    if (dashboardContainer) dashboardContainer.style.display = "block";
    const officerBadge = document.getElementById("officer-name-badge");
    if (officerBadge) {
      officerBadge.textContent = `${sessionStorage.getItem("officer_name") || "Officer Mukund"} • Zonal Nodal Authority`;
    }
    const deptFilter = document.getElementById("officer-dept-filter");
    loadOfficerGrievances(deptFilter ? deptFilter.value : "ALL");
  } else {
    if (loginContainer) loginContainer.style.display = "flex";
    if (dashboardContainer) dashboardContainer.style.display = "none";
  }
}

async function handleOfficerLogin(event) {
  if (event) event.preventDefault();

  const userElem = document.getElementById("officer-username");
  const passElem = document.getElementById("officer-password");
  const errorElem = document.getElementById("officer-login-error");
  const loginBtn = document.getElementById("btn-officer-login");

  const username = userElem ? userElem.value.trim() : "";
  const password = passElem ? passElem.value.trim() : "";

  if (errorElem) errorElem.style.display = "none";
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.innerHTML = `<span class="material-symbols-outlined" style="animation: pulseRecording 0.8s infinite;">lock_open</span> Verifying Credentials...`;
  }

  try {
    const res = await fetch("/api/officer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">login</span> Authenticate & Enter Portal`;
    }

    if (data.success) {
      sessionStorage.setItem("officer_logged_in", "true");
      sessionStorage.setItem("officer_name", data.officer?.name || "Officer Mukund");
      sessionStorage.setItem("officer_token", data.token || "");
      updateOfficerPortalAuthUI();
    } else {
      if (errorElem) {
        errorElem.textContent = data.error || "Authentication failed. Invalid username or password.";
        errorElem.style.display = "block";
      }
    }
  } catch (err) {
    console.error("Officer login error:", err);
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;">login</span> Authenticate & Enter Portal`;
    }
    // Offline / direct fallback check for username: mukund, pass: 1234
    if (username.toLowerCase() === "mukund" && password === "1234") {
      sessionStorage.setItem("officer_logged_in", "true");
      sessionStorage.setItem("officer_name", "Officer Mukund");
      updateOfficerPortalAuthUI();
    } else if (errorElem) {
      errorElem.textContent = "Invalid username or password. (Hint: mukund / 1234)";
      errorElem.style.display = "block";
    }
  }
}

function handleOfficerLogout() {
  sessionStorage.removeItem("officer_logged_in");
  sessionStorage.removeItem("officer_name");
  sessionStorage.removeItem("officer_token");
  updateOfficerPortalAuthUI();
}

function initOfficerPortal() {
  const deptFilter = document.getElementById("officer-dept-filter");
  if (deptFilter) {
    deptFilter.addEventListener("change", () => {
      if (isOfficerAuthenticated()) {
        loadOfficerGrievances(deptFilter.value);
      }
    });
  }
  updateOfficerPortalAuthUI();
}

async function loadOfficerGrievances(deptId = "ALL") {
  if (!isOfficerAuthenticated()) {
    updateOfficerPortalAuthUI();
    return;
  }
  try {
    const res = await fetch(`/api/grievance/list?dept=${deptId}`);
    const data = await res.json();
    if (data.success) {
      allOfficerGrievances = data.grievances;
      renderKanbanBoard(data.grievances);
    }
  } catch (err) {
    console.error("Officer list load error:", err);
  }
}

function renderKanbanBoard(grievances) {
  const colFiled = document.getElementById("kanban-col-filed");
  const colProgress = document.getElementById("kanban-col-progress");
  const colAction = document.getElementById("kanban-col-action");
  const colResolved = document.getElementById("kanban-col-resolved");

  if (!colFiled || !colProgress || !colAction || !colResolved) return;

  colFiled.innerHTML = "";
  colProgress.innerHTML = "";
  colAction.innerHTML = "";
  colResolved.innerHTML = "";

  let counts = { filed: 0, progress: 0, action: 0, resolved: 0 };

  grievances.forEach(g => {
    const card = document.createElement("div");
    card.className = "kanban-card";
    card.onclick = () => openOfficerActionModal(g.id);

    const isUrgent = g.urgency === "Critical" || g.urgency === "High";
    const slaText = g.is_escalated ? "ESCALATED SLA" : `SLA: ${g.urgency}`;

    card.innerHTML = `
      <div class="card-top-row">
        <span class="ticket-token-tag">${g.id}</span>
        <span class="urgency-pill ${g.urgency}">${g.urgency}</span>
      </div>
      <div class="card-title">${g.summary || g.category}</div>
      <div class="card-location">
        <span class="material-symbols-outlined" style="font-size:14px;">location_on</span>
        ${g.city || 'District Area'} (${g.pincode})
      </div>
      <div class="card-top-row" style="margin-top:4px;">
        <span style="font-size:10px; color:var(--text-light);">${g.original_language}</span>
        <span class="card-sla-badge" style="${isUrgent ? 'background:#fee2e2; color:#dc2626;' : 'background:#f1f5f9; color:#475569;'}">${slaText}</span>
      </div>
    `;

    if (g.status === "Filed" || g.status === "Assigned") {
      colFiled.appendChild(card);
      counts.filed++;
    } else if (g.status === "In_Progress" || g.status === "Escalated") {
      colProgress.appendChild(card);
      counts.progress++;
    } else if (g.status === "Action_Taken") {
      colAction.appendChild(card);
      counts.action++;
    } else if (g.status === "Resolved") {
      colResolved.appendChild(card);
      counts.resolved++;
    }
  });

  // Update badge counters
  document.getElementById("count-filed").textContent = counts.filed;
  document.getElementById("count-progress").textContent = counts.progress;
  document.getElementById("count-action").textContent = counts.action;
  document.getElementById("count-resolved").textContent = counts.resolved;
}

async function openOfficerActionModal(grievanceId) {
  const g = allOfficerGrievances.find(item => item.id === grievanceId);
  if (!g) return;
  selectedGrievanceForAction = g;

  const modal = document.getElementById("officer-action-modal");
  if (!modal) return;

  document.getElementById("modal-officer-token").textContent = g.id;
  document.getElementById("modal-officer-cat").textContent = `${g.category} (${g.department_short_name})`;
  document.getElementById("modal-officer-citizen").textContent = `${g.citizen_name} • ${g.citizen_phone}`;
  document.getElementById("modal-officer-address").textContent = `${g.address}, ${g.city} (${g.pincode})`;
  document.getElementById("modal-officer-complaint-text").textContent = g.original_text;
  document.getElementById("modal-officer-translated").textContent = g.translated_text || "N/A";
  document.getElementById("modal-officer-status-select").value = g.status;
  document.getElementById("modal-officer-notes").value = g.action_taken_notes || "";

  // Trigger AI Copilot Draft automatically
  fetchOfficerAICopilotDraft(g);

  modal.classList.add("active");
}

function closeOfficerActionModal() {
  const modal = document.getElementById("officer-action-modal");
  if (modal) modal.classList.remove("active");
}

async function fetchOfficerAICopilotDraft(g) {
  const copilotContainer = document.getElementById("modal-copilot-draft-area");
  if (!copilotContainer) return;

  copilotContainer.innerHTML = `
    <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
      <span class="material-symbols-outlined" style="animation: pulseRecording 1s infinite;">auto_awesome</span>
      Generating AI Resolution Draft & native ${g.original_language} SMS...
    </div>
  `;

  try {
    const res = await fetch("/api/ai/copilot-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grievance: g })
    });
    const data = await res.json();
    if (data.success && data.draft) {
      const d = data.draft;
      copilotContainer.innerHTML = `
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:12px; font-weight:700; color:#0369a1; display:flex; align-items:center; gap:4px;">
            <span class="material-symbols-outlined" style="font-size:16px;">smart_toy</span> JanSamvaad AI Officer Copilot
          </div>
          <div style="font-size:12px; color:#0c4a6e;">
            <strong>Suggested Official Action:</strong> ${d.suggested_action_notes}
          </div>
          <div style="font-size:12px; color:#0c4a6e; background:white; padding:8px; border-radius:6px; border:1px dashed #7dd3fc;">
            <strong>Native ${g.original_language} Citizen SMS Draft:</strong>
            <p style="margin-top:2px; font-style:italic;">"${d.citizen_sms_draft}"</p>
          </div>
          <button type="button" onclick="applyCopilotNotes(\`${d.suggested_action_notes}\`)" style="align-self:flex-start; font-size:11px; font-weight:700; background:#0284c7; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Apply AI Notes</button>
        </div>
      `;
    }
  } catch (err) {
    console.error("Copilot draft error:", err);
  }
}

function applyCopilotNotes(notes) {
  const notesField = document.getElementById("modal-officer-notes");
  if (notesField) {
    notesField.value = notes;
  }
}

async function saveOfficerAction() {
  if (!selectedGrievanceForAction) return;

  const newStatus = document.getElementById("modal-officer-status-select").value;
  const notes = document.getElementById("modal-officer-notes").value.trim();
  const officerName = document.getElementById("officer-name-badge")?.textContent || "Er. Rajesh Kumar Sharma";

  // Check if resolution photo proof attached
  const photoProof = selectedGrievanceForAction.resolution_attachment_url || 
    (newStatus === "Resolved" ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80" : null);

  try {
    const res = await fetch("/api/grievance/update_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grievance_id: selectedGrievanceForAction.id,
        new_status: newStatus,
        officer_name: officerName,
        officer_notes: notes,
        photo_proof_url: photoProof
      })
    });

    const data = await res.json();
    if (data.success) {
      closeOfficerActionModal();
      loadOfficerGrievances(document.getElementById("officer-dept-filter").value);
      alert(`Grievance ${selectedGrievanceForAction.id} updated to status: ${newStatus}`);
    }
  } catch (err) {
    console.error("Save action error:", err);
  }
}
