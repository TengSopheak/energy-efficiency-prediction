import { $ as querySelector, $$ as querySelectorAll, toast } from '../utils/utils.js';
import { INPUTS, state, applyValues } from './form.js';
import { clearResultsBtn } from '../ui/ui-behaviors.js';

const $ = querySelector;
const $$ = querySelectorAll;

/* ============================================================
   PREDICTION MODEL (heuristic approximating trained regressor)
   ============================================================ */
export function predict(features) {
    const {
        compactness,
        surfaceArea,
        wallArea,
        roofArea,
        height,
        orientation,
        glazingArea,
        glazingDist,
    } = features;

    // Normalized contributions (calibrated to approximate UCI dataset behavior)
    const c = (compactness - 0.5) / 0.5;
    const s = (surfaceArea - 200) / 600;
    const w = (wallArea - 150) / 200;
    const r = (roofArea - 80) / 200;
    const h = (height - 2.5) / 4.5;
    const g = glazingArea / 0.4;
    const orientIdx = ["North", "East", "South", "West"].indexOf(orientation);
    const o = (orientIdx - 1.5) / 1.5;
    const distIdx = parseInt(glazingDist.charAt(0));
    const d = distIdx / 5;

    // Heating load model (kWh/m²)
    const heating =
        8 +
        6 * c +
        4 * s +
        8 * w -
        4 * r +
        14 * h +
        5 * g +
        1.2 * Math.abs(o) +
        2.5 * d +
        (Math.random() - 0.5) * 1.2;

    // Cooling load model
    const cooling =
        12 +
        5 * c +
        3 * s +
        6 * w -
        3 * r +
        11 * h +
        9 * g +
        2.5 * o +
        4 * d +
        (Math.random() - 0.5) * 1.2;

    const heatingClamped = Math.max(5, Math.min(48, heating));
    const coolingClamped = Math.max(8, Math.min(50, cooling));

    // Confidence: based on distance from training distribution
    const dist =
        Math.abs(c) + Math.abs(s - 0.5) + Math.abs(w - 0.5) + Math.abs(h - 0.5);
    const confidence = Math.max(
        0.82,
        Math.min(0.98, 0.96 - dist * 0.04 + (Math.random() - 0.5) * 0.02),
    );

    // Feature contributions (SHAP-like)
    const contributions = [
        { name: "Relative Compactness", value: Math.abs(6 * c) },
        { name: "Surface Area", value: Math.abs(4 * s) },
        { name: "Wall Area", value: Math.abs(8 * w) },
        { name: "Roof Area", value: Math.abs(4 * r) },
        { name: "Overall Height", value: Math.abs(14 * h) },
        { name: "Orientation", value: Math.abs(2 * o) },
        { name: "Glazing Area", value: Math.abs(9 * g) },
        { name: "Glazing Distribution", value: Math.abs(4 * d) },
    ].sort((a, b) => b.value - a.value);

    return {
        heating: heatingClamped,
        cooling: coolingClamped,
        confidence,
        contributions,
    };
}

/* ============================================================
   PREDICTION FLOW
   ============================================================ */
const predictBtn = $("#predictBtn");
const predictContent = $("#predictContent");
const resultsSection = $("#resultsSection");

if (predictBtn && predictContent && resultsSection) {
    predictBtn.addEventListener("click", () => {
        // Validate
        for (const inp of INPUTS) {
            if (inp.type === "number") {
                const v = state[inp.id];
                if (isNaN(v) || v < inp.min || v > inp.max) {
                    toast(
                        `${inp.label} must be between ${inp.min} and ${inp.max}`,
                        "error",
                    );
                    return;
                }
            }
        }

        // Loading state
        predictContent.innerHTML = `
    <div class="w-5 h-5 rounded-full border-2 border-slate-900/30 border-t-slate-900 spin"></div>
    <span>Running inference...</span>
  `;
        predictBtn.classList.add("pulse-ring");

        // Simulate inference time
        setTimeout(() => {
            const result = predict(state);
            displayResults(result);
            predictContent.innerHTML = `<i class="fa-solid fa-bolt"></i> Predict Energy Efficiency <i class="fa-solid fa-arrow-right text-xs"></i>`;
            predictBtn.classList.remove("pulse-ring");
            toast("Prediction complete", "success");

            // Scroll to results
            setTimeout(
                () =>
                    resultsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    }),
                100,
            );
        }, 900);
    });
}

export let lastResult = null;

export function displayResults(result) {
    lastResult = result;
    resultsSection.classList.remove("hidden");

    // Animate heating gauge
    const heatingGauge = $("#heatingGauge");
    const heatingValue = $("#heatingValue");
    const heatingLabel = $("#heatingLabel");
    const heatPct = Math.min(1, result.heating / 50);
    heatingGauge.style.strokeDashoffset = 534 * (1 - heatPct);
    animateNumber(heatingValue, 0, result.heating, 1400, 1);
    heatingLabel.innerHTML =
        result.heating < 15
            ? '<span class="text-emerald-400">●</span> Excellent — low heating demand'
            : result.heating < 25
              ? '<span class="text-cyan-400">●</span> Moderate — typical residential'
              : '<span class="text-orange-400">●</span> High — consider envelope upgrades';

    // Animate cooling gauge
    const coolingGauge = $("#coolingGauge");
    const coolingValue = $("#coolingValue");
    const coolingLabel = $("#coolingLabel");
    const coolPct = Math.min(1, result.cooling / 50);
    coolingGauge.style.strokeDashoffset = 534 * (1 - coolPct);
    animateNumber(coolingValue, 0, result.cooling, 1400, 1);
    coolingLabel.innerHTML =
        result.cooling < 18
            ? '<span class="text-emerald-400">●</span> Excellent — low cooling demand'
            : result.cooling < 30
              ? '<span class="text-cyan-400">●</span> Moderate — typical residential'
              : '<span class="text-orange-400">●</span> High — solar control recommended';

    // Sparklines
    setTimeout(() => {
        $("#heatingSpark").classList.add("draw");
        $("#coolingSpark").classList.add("draw");
    }, 100);

    // Confidence
    const confidenceValue = $("#confidenceValue");
    const confidenceBar = $("#confidenceBar");
    animateNumber(
        confidenceValue,
        0,
        Math.round(result.confidence * 100),
        1200,
        0,
    );
    setTimeout(() => {
        confidenceBar.style.width = result.confidence * 100 + "%";
    }, 200);

    // Feature importance
    const fi = $("#featureImportance");
    const max = Math.max(...result.contributions.map((c) => c.value));
    fi.innerHTML = result.contributions
        .map(
            (c, i) => `
    <div class="flex items-center gap-3">
      <div class="text-[11px] text-slate-400 w-36 truncate">${c.name}</div>
      <div class="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-linear-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-1000" style="width: 0%; transition-delay: ${i * 80}ms;" data-target="${((c.value / max) * 100).toFixed(0)}"></div>
      </div>
      <div class="text-[11px] font-mono text-slate-300 w-10 text-right">${((c.value / max) * 100).toFixed(0)}%</div>
    </div>
  `,
        )
        .join("");
    setTimeout(() => {
        $$("#featureImportance [data-target]").forEach(
            (b) => (b.style.width = b.dataset.target + "%"),
        );
    }, 100);
}

export function animateNumber(el, from, to, duration, decimals) {
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = from + (to - from) * eased;
        el.textContent = cur.toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

if (clearResultsBtn) {
    clearResultsBtn.addEventListener("click", () => {
        resultsSection.classList.add("hidden");
        toast("Results cleared", "info");
    });
}
