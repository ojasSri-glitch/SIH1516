/**
 * JanSamvaad AI - Bhashini & Indic NLP Pipeline Inspector (SIH Jury Special)
 */

document.addEventListener("DOMContentLoaded", () => {
  initPipelineInspector();
});

function initPipelineInspector() {
  const inspectBtn = document.getElementById("pipeline-inspect-btn");
  const testInput = document.getElementById("pipeline-test-input");

  if (inspectBtn && testInput) {
    inspectBtn.addEventListener("click", () => {
      runPipelineInspection(testInput.value.trim());
    });
  }

  // Pre-fill and run default sample
  if (testInput) {
    testInput.value = "हमारे इलाके मयूर विहार में 3 दिन से पानी की पाइपलाइन फटी हुई है, लाखों लीटर साफ पानी बह रहा है";
    runPipelineInspection(testInput.value);
  }
}

function setPipelineSample(text) {
  const testInput = document.getElementById("pipeline-test-input");
  if (testInput) {
    testInput.value = text;
    runPipelineInspection(text);
  }
}

async function runPipelineInspection(text) {
  if (!text) return;

  const btn = document.getElementById("pipeline-inspect-btn");
  if (btn) btn.textContent = "Processing Bhashini Pipeline...";

  try {
    const res = await fetch("/api/ai/inspect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text })
    });

    const data = await res.json();
    if (btn) btn.textContent = "Run Pipeline Inspection";

    if (data.success && data.trace) {
      renderPipelineTrace(data.trace);
    }
  } catch (err) {
    console.error("Pipeline trace error:", err);
    if (btn) btn.textContent = "Run Pipeline Inspection";
  }
}

function renderPipelineTrace(trace) {
  // Stage 1
  document.getElementById("trace-stage-1").textContent = JSON.stringify(trace.stage_1_bhashini_stt, null, 2);
  // Stage 2
  document.getElementById("trace-stage-2").textContent = JSON.stringify(trace.stage_2_indic_translation, null, 2);
  // Stage 3
  document.getElementById("trace-stage-3").textContent = JSON.stringify(trace.stage_3_ner_extraction, null, 2);
  // Stage 4
  document.getElementById("trace-stage-4").textContent = JSON.stringify(trace.stage_4_intent_routing, null, 2);
  // Stage 5
  document.getElementById("trace-stage-5").textContent = JSON.stringify(trace.stage_5_sla_and_duplicate_clustering, null, 2);
}
