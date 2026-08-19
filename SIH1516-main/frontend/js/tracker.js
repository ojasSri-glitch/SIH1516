/**
 * JanSamvaad AI - Real-time Grievance Tracker & SLA Escalation Engine
 */

let activeTrackingGrievance = null;

document.addEventListener("DOMContentLoaded", () => {
  initTrackerView();
});

function initTrackerView() {
  const trackForm = document.getElementById("track-form");
  const trackInput = document.getElementById("track-input");

  if (trackForm) {
    trackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = trackInput.value.trim();
      if (query) {
        fetchAndRenderTracking(query);
      }
    });
  }

  // Pre-load default demo case
  fetchAndRenderTracking("JAN-2026-78412");
}

async function fetchAndRenderTracking(tokenId) {
  const container = document.getElementById("tracking-results-area");
  if (!container) return;

  try {
    const res = await fetch(`/api/grievance/track?id=${encodeURIComponent(tokenId)}`);
    const data = await res.json();

    if (data.success && data.grievance) {
      activeTrackingGrievance = data.grievance;
      renderGrievanceDetails(data.grievance);
    } else {
      container.innerHTML = `
        <div style="background:var(--bg-surface); padding:30px; border-radius:12px; border:1px dashed var(--border-color); text-align:center;">
          <span class="material-symbols-outlined" style="font-size:40px; color:#94a3b8;">search_off</span>
          <h3 style="margin-top:10px;">No Grievance Record Found</h3>
          <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">Please verify your Token ID (e.g., JAN-2026-78412) or try searching by 10-digit mobile number.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error("Tracking lookup error:", err);
  }
}

function renderGrievanceDetails(g) {
  const container = document.getElementById("tracking-results-area");
  if (!container) return;

  // Timeline events HTML
  let timelineHtml = "";
  if (g.timeline && g.timeline.length > 0) {
    timelineHtml = g.timeline.map((ev, index) => {
      const isLast = index === g.timeline.length - 1;
      const isResolved = ev.event_type === "Resolved";
      const isEscalated = ev.event_type === "Escalated";
      
      let nodeClass = "step-node completed";
      if (isLast && !isResolved) nodeClass += " current";

      return `
        <div class="${nodeClass}">
          <div class="step-dot">
            <span class="material-symbols-outlined" style="font-size:12px;">${isResolved ? 'check' : (isEscalated ? 'priority_high' : 'circle')}</span>
          </div>
          <div class="step-title">${ev.title}</div>
          <div class="step-desc">${ev.description}</div>
          <div class="step-time">Action by <strong>${ev.actor}</strong> (${ev.actor_role}) • ${ev.created_at}</div>
          ${ev.attachment_url ? `<div style="margin-top:8px;"><img src="${ev.attachment_url}" style="width:120px; border-radius:6px; border:1px solid #cbd5e1;" /></div>` : ''}
        </div>
      `;
    }).join("");
  }

  // Escalation alert if escalated
  let escalationBanner = "";
  if (g.is_escalated || g.status === "Escalated") {
    escalationBanner = `
      <div style="background:#fee2e2; border-left:4px solid #dc2626; padding:12px 16px; border-radius:6px; margin-bottom:16px;">
        <strong style="color:#b91c1c; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-outlined" style="font-size:18px;">warning</span> High-Priority SLA Escalation Active
        </strong>
        <p style="color:#7f1d1d; font-size:12px; margin-top:2px;">${g.escalation_reason || 'Case flagged for immediate administrative intervention.'}</p>
      </div>
    `;
  }

  // Photo attachment preview if present
  let photoSection = "";
  if (g.attachment_url) {
    photoSection = `
      <div style="margin-top:16px;">
        <label style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Citizen Photo Evidence</label>
        <div style="margin-top:6px; max-width:280px; border-radius:8px; overflow:hidden; border:1px solid var(--border-color);">
          <img src="${g.attachment_url}" style="width:100%; display:block;" alt="Citizen Photo" />
        </div>
      </div>
    `;
  }

  // Resolution photo proof if resolved
  let resolutionProof = "";
  if (g.status === "Resolved" && g.resolution_attachment_url) {
    resolutionProof = `
      <div style="margin-top:16px; background:#f0fdf4; padding:12px; border-radius:8px; border:1px solid #bbf7d0;">
        <label style="font-size:11px; font-weight:700; color:#15803d; text-transform:uppercase;">Officer Resolution Photo Proof (After Fix)</label>
        <div style="margin-top:6px; max-width:280px; border-radius:8px; overflow:hidden; border:1px solid #86efac;">
          <img src="${g.resolution_attachment_url}" style="width:100%; display:block;" alt="Resolution Proof" />
        </div>
        <p style="font-size:12px; color:#166534; margin-top:6px;"><strong>Action Taken Notes:</strong> ${g.action_taken_notes || 'Rectification verified.'}</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="ticket-status-grid">
      <!-- Left Column: Details & Vertical Stepper -->
      <div class="ticket-details-card">
        ${escalationBanner}
        <div class="ticket-head-flex">
          <div>
            <div style="font-size:11px; font-weight:700; color:var(--primary-blue); text-transform:uppercase;">Token ID: ${g.id}</div>
            <h2 style="font-size:18px; font-weight:800; margin-top:2px;">${g.category}</h2>
            <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${g.department_name}</div>
          </div>
          <span class="status-badge ${g.status}">${g.status.replace('_', ' ')}</span>
        </div>

        <div style="background:var(--bg-subtle); padding:14px; border-radius:8px; border:1px solid var(--border-color); font-size:13px;">
          <div style="font-weight:700; color:var(--text-muted); font-size:11px; text-transform:uppercase; margin-bottom:4px;">Original Grievance (${g.original_language})</div>
          <p style="color:var(--text-main); font-style:italic;">"${g.original_text}"</p>
          ${g.translated_text && g.original_language !== 'English' ? `
            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-color); color:var(--text-muted);">
              <strong>English AI Normalization:</strong> ${g.translated_text}
            </div>
          ` : ''}
        </div>

        ${photoSection}
        ${resolutionProof}

        <h3 style="font-size:15px; font-weight:800; margin-top:24px; display:flex; align-items:center; gap:8px;">
          <span class="material-symbols-outlined" style="font-size:20px; color:var(--primary-blue);">timeline</span> Audit & Action Stepper
        </h3>

        <div class="stepper-timeline">
          ${timelineHtml}
        </div>
      </div>

      <!-- Right Column: Nodal Officer & Citizen Actions -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="officer-contact-card">
          <h4 style="font-size:14px; font-weight:800; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">Assigned Nodal Authority</h4>
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; border-radius:50%; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:20px;">
              <span class="material-symbols-outlined">person</span>
            </div>
            <div>
              <div style="font-weight:700; font-size:14px;">${g.assigned_officer}</div>
              <div style="font-size:12px; color:var(--text-muted);">${g.department_short_name}</div>
            </div>
          </div>

          <div style="margin-top:16px; font-size:12px; display:flex; flex-direction:column; gap:6px;">
            <div><strong>Contact:</strong> ${g.assigned_officer_contact || '+91 11 2300 0000'}</div>
            <div><strong>Location:</strong> ${g.address}, ${g.city} (${g.pincode})</div>
            <div><strong>Target SLA:</strong> <span style="color:#b45309; font-weight:700;">${g.estimated_resolution_time}</span></div>
          </div>

          <button class="btn-escalate" onclick="openEscalateModal('${g.id}')">
            <span class="material-symbols-outlined" style="font-size:16px;">priority_high</span> Escalate to Nodal Head
          </button>
        </div>

        <!-- Citizen Feedback Section -->
        <div class="officer-contact-card">
          <h4 style="font-size:14px; font-weight:800; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:12px;">Citizen Satisfaction</h4>
          <div style="display:flex; gap:6px; font-size:24px; color:#fbbf24; cursor:pointer;" id="star-rating-box">
            <span onclick="setRating(1)">★</span>
            <span onclick="setRating(2)">★</span>
            <span onclick="setRating(3)">★</span>
            <span onclick="setRating(4)">★</span>
            <span onclick="setRating(5)">★</span>
          </div>
          <textarea id="feedback-comment" placeholder="Share your experience with resolution speed & quality..." style="width:100%; margin-top:10px; padding:8px; border-radius:6px; border:1px solid var(--border-color); font-size:12px; font-family:inherit;" rows="2"></textarea>
          <button onclick="submitCitizenFeedback('${g.id}')" style="margin-top:8px; width:100%; padding:8px; background:var(--primary-blue); color:white; border:none; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">Submit Rating</button>
        </div>
      </div>
    </div>
  `;
}

let selectedRatingVal = 5;
function setRating(val) {
  selectedRatingVal = val;
  const stars = document.querySelectorAll("#star-rating-box span");
  stars.forEach((s, idx) => {
    s.style.color = idx < val ? "#f59e0b" : "#cbd5e1";
  });
}

async function submitCitizenFeedback(grievanceId) {
  const comment = document.getElementById("feedback-comment")?.value || "";
  try {
    const res = await fetch("/api/grievance/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grievance_id: grievanceId,
        rating: selectedRatingVal,
        comment: comment
      })
    });
    const data = await res.json();
    if (data.success) {
      alert("Thank you! Your feedback has been recorded in the National Redressal Index.");
    }
  } catch (err) {
    console.error("Feedback error:", err);
  }
}

function openEscalateModal(grievanceId) {
  const modal = document.getElementById("escalate-modal");
  if (!modal) return;
  document.getElementById("escalate-grievance-id-hidden").value = grievanceId;
  modal.classList.add("active");
}

function closeEscalateModal() {
  const modal = document.getElementById("escalate-modal");
  if (modal) modal.classList.remove("active");
}

async function confirmEscalation() {
  const grievanceId = document.getElementById("escalate-grievance-id-hidden").value;
  const reason = document.getElementById("escalate-reason-text").value.trim() || "No response received within promised SLA period.";

  try {
    const res = await fetch("/api/grievance/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grievance_id: grievanceId,
        reason: reason
      })
    });
    const data = await res.json();
    if (data.success) {
      closeEscalateModal();
      fetchAndRenderTracking(grievanceId);
      alert("Grievance escalated to Tier-2 Nodal Superintending Officer with CRITICAL SLA flag.");
    }
  } catch (err) {
    console.error("Escalate error:", err);
  }
}
