/**
 * JanSamvaad AI - Ministry GIS Heatmap & Analytics Engine
 */

let mapInstance = null;
let deptChartInstance = null;
let langChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  // Lazy init on tab switch or ready
});

async function initAnalyticsView() {
  try {
    const res = await fetch("/api/stats/dashboard");
    const data = await res.json();
    if (data.success && data.stats) {
      renderDashboardMetrics(data.stats);
      renderLeafletGISMap(data.stats.map_points);
      renderAnalyticsCharts(data.stats);
    }
  } catch (err) {
    console.error("Analytics fetch error:", err);
  }
}

function renderDashboardMetrics(stats) {
  const totalElem = document.getElementById("analytics-total-count");
  const resolvedElem = document.getElementById("analytics-resolved-count");
  const inProgressElem = document.getElementById("analytics-inprogress-count");
  const escalatedElem = document.getElementById("analytics-escalated-count");
  const rateElem = document.getElementById("analytics-rate-num");

  if (totalElem) totalElem.textContent = stats.total_grievances;
  if (resolvedElem) resolvedElem.textContent = stats.resolved_grievances;
  if (inProgressElem) inProgressElem.textContent = stats.in_progress_grievances;
  if (escalatedElem) escalatedElem.textContent = stats.escalated_grievances;
  if (rateElem) rateElem.textContent = `${stats.resolution_rate}%`;
}

function renderLeafletGISMap(points) {
  const mapContainer = document.getElementById("map-container");
  if (!mapContainer || typeof L === "undefined") return;

  if (mapInstance) {
    mapInstance.remove();
  }

  // Centered on India (20.5937° N, 78.9629° E)
  mapInstance = L.map('map-container').setView([21.8, 79.5], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors | JanSamvaad AI GIS'
  }).addTo(mapInstance);

  const urgencyColors = {
    Critical: "#dc2626",
    High: "#ea580c",
    Medium: "#eab308",
    Low: "#16a34a"
  };

  points.forEach(pt => {
    if (pt.latitude && pt.longitude) {
      const color = urgencyColors[pt.urgency] || "#0284c7";
      const marker = L.circleMarker([pt.latitude, pt.longitude], {
        radius: pt.urgency === "Critical" ? 10 : 7,
        fillColor: color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(mapInstance);

      marker.bindPopup(`
        <div style="font-family:inherit; min-width:180px;">
          <div style="font-size:11px; font-weight:800; color:${color}; text-transform:uppercase;">${pt.urgency} Urgency</div>
          <div style="font-size:13px; font-weight:700; margin-top:2px;">${pt.id}: ${pt.category}</div>
          <div style="font-size:12px; color:#475569; margin-top:4px;">${pt.summary || ''}</div>
          <div style="font-size:11px; color:#64748b; margin-top:6px;">📍 ${pt.city}, ${pt.state}</div>
          <button onclick="fetchAndRenderTracking('${pt.id}'); switchTab('tab-track');" style="margin-top:8px; width:100%; padding:4px 8px; background:#1d4ed8; color:white; border:none; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer;">Inspect Details</button>
        </div>
      `);
    }
  });
}

function renderAnalyticsCharts(stats) {
  if (typeof Chart === "undefined") return;

  // 1. Department Distribution Bar Chart
  const deptCtx = document.getElementById("dept-chart")?.getContext("2d");
  if (deptCtx) {
    if (deptChartInstance) deptChartInstance.destroy();

    const labels = stats.department_stats.map(d => d.short_name);
    const dataCounts = stats.department_stats.map(d => d.count);
    const colors = stats.department_stats.map(d => d.color || "#0284c7");

    deptChartInstance = new Chart(deptCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Grievances',
          data: dataCounts,
          backgroundColor: colors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Language Adoption Donut Chart
  const langCtx = document.getElementById("lang-chart")?.getContext("2d");
  if (langCtx) {
    if (langChartInstance) langChartInstance.destroy();

    const langLabels = stats.language_stats.map(l => l.original_language);
    const langCounts = stats.language_stats.map(l => l.count);

    langChartInstance = new Chart(langCtx, {
      type: 'doughnut',
      data: {
        labels: langLabels,
        datasets: [{
          data: langCounts,
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }
}
