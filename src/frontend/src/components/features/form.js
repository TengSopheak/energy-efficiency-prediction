import { $ as querySelector, $$ as querySelectorAll, toast } from '../utils/utils.js';
import { sampleBtn, randomBtn, resetBtn } from '../ui/ui-behaviors.js';

const $ = querySelector;
const $$ = querySelectorAll;

/* ============================================================
   INPUT DEFINITIONS
   ============================================================ */
export const INPUTS = [
    {
        id: "compactness",
        label: "Relative Compactness",
        icon: "fa-compress",
        desc: "Surface area divided by volume — building form efficiency.",
        type: "slider",
        min: 0.5,
        max: 1.0,
        step: 0.01,
        default: 0.75,
        unit: "",
    },
    {
        id: "surfaceArea",
        label: "Surface Area",
        icon: "fa-square",
        desc: "Total external envelope exposed to the environment.",
        type: "number",
        min: 100,
        max: 900,
        step: 1,
        default: 514,
        unit: "m²",
    },
    {
        id: "wallArea",
        label: "Wall Area",
        icon: "fa-grip-lines",
        desc: "Vertical opaque envelope — primary heat loss surface.",
        type: "number",
        min: 100,
        max: 400,
        step: 1,
        default: 245,
        unit: "m²",
    },
    {
        id: "roofArea",
        label: "Roof Area",
        icon: "fa-square",
        desc: "Horizontal envelope exposed to solar gain and sky.",
        type: "number",
        min: 50,
        max: 300,
        step: 1,
        default: 110,
        unit: "m²",
    },
    {
        id: "height",
        label: "Overall Height",
        icon: "fa-arrows-up-to-line",
        desc: "Building height — drives vertical heat stratification.",
        type: "slider",
        min: 2.5,
        max: 7.0,
        step: 0.1,
        default: 3.5,
        unit: "m",
    },
    {
        id: "orientation",
        label: "Orientation",
        icon: "fa-compass",
        desc: "Primary facade cardinal direction.",
        type: "select",
        options: ["North", "East", "South", "West"],
        default: "North",
        unit: "",
    },
    {
        id: "glazingArea",
        label: "Glazing Area",
        icon: "fa-window-maximize",
        desc: "Window-to-wall ratio (0 = opaque, 0.4 = fully glazed).",
        type: "slider",
        min: 0.0,
        max: 0.4,
        step: 0.01,
        default: 0.1,
        unit: "",
    },
    {
        id: "glazingDist",
        label: "Glazing Distribution",
        icon: "fa-table-cells-large",
        desc: "How windows are distributed across facades.",
        type: "select",
        options: [
            "0 — None",
            "1 — North",
            "2 — East",
            "3 — South",
            "4 — West",
            "5 — All",
        ],
        default: "0 — None",
        unit: "",
    },
];

export const state = {};
INPUTS.forEach((i) => (state[i.id] = i.default));

/* ============================================================
   BUILD INPUTS UI
   ============================================================ */
const inputsContainer = $("#inputsContainer");
if (inputsContainer && inputsContainer.children.length === 0) {
    INPUTS.forEach((inp, idx) => {
        const row = document.createElement("div");
        row.className =
            "input-row glass rounded-xl p-4 border border-transparent";
        row.dataset.id = inp.id;

        let controlHTML = "";
        if (inp.type === "slider") {
            const pct = ((inp.default - inp.min) / (inp.max - inp.min)) * 100;
            controlHTML = `
      <div class="flex items-center gap-3 mt-2">
        <input type="range" class="slider flex-1" id="in-${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.default}" aria-label="${inp.label}" />
        <div class="font-mono text-sm font-bold text-white min-w-15 text-right">
          <span id="val-${inp.id}">${inp.default.toFixed(inp.step < 1 ? 2 : 0)}</span><span class="text-slate-500 text-xs ml-1">${inp.unit}</span>
        </div>
      </div>
      <div class="h-1 mt-2 rounded-full bg-slate-800 overflow-hidden">
        <div id="fill-${inp.id}" class="h-full bg-linear-to-r from-emerald-400 to-cyan-400 transition-all duration-300" style="width: ${pct}%;"></div>
      </div>
    `;
        } else if (inp.type === "number") {
            controlHTML = `
      <div class="flex items-center gap-3 mt-2">
        <input type="number" class="num-input flex-1 px-3 py-2.5 rounded-lg text-sm font-mono" id="in-${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.default}" aria-label="${inp.label}" />
        <span class="text-xs text-slate-500 font-mono">${inp.unit}</span>
      </div>
    `;
        } else if (inp.type === "select") {
            controlHTML = `
      <select class="select-input w-full mt-2 px-3 py-2.5 rounded-lg text-sm" id="in-${inp.id}" aria-label="${inp.label}">
        ${inp.options.map((o) => `<option value="${o}" ${o === inp.default ? "selected" : ""}>${o}</option>`).join("")}
      </select>
    `;
        }

        row.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
        <i class="fa-solid ${inp.icon} text-emerald-400 text-xs"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <label class="text-sm font-medium text-slate-200">${inp.label}</label>
          <span class="text-[10px] font-mono text-slate-500">${String(idx + 1).padStart(2, "0")}</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">${inp.desc}</p>
        ${controlHTML}
      </div>
    </div>
  `;
        inputsContainer.appendChild(row);

        // Bind event
        const el = $("#in-" + inp.id);
        const valEl = $("#val-" + inp.id);
        const fillEl = $("#fill-" + inp.id);

        el.addEventListener("input", () => {
            let v = el.value;
            if (inp.type === "slider" || inp.type === "number")
                v = parseFloat(v);
            state[inp.id] = v;

            if (inp.type === "slider") {
                valEl.textContent = v.toFixed(inp.step < 1 ? 2 : 0);
                const pct = ((v - inp.min) / (inp.max - inp.min)) * 100;
                fillEl.style.width = pct + "%";
            }

            // Highlight active row
            $$(".input-row").forEach((r) => r.classList.remove("active"));
            row.classList.add("active");
            $("#activeParam").textContent = inp.label;

            // Notify 3D
            if (window.building3D) window.building3D.setFeature(inp.id, v);

            // Badge
            const badge = $("#viewerBadge");
            badge.innerHTML = `<span class="text-emerald-400">●</span> Editing: ${inp.label}`;
            clearTimeout(window._badgeTimer);
            window._badgeTimer = setTimeout(() => {
                badge.innerHTML = `<span class="text-emerald-400">●</span> Idle`;
            }, 1500);
        });

        el.addEventListener("focus", () => {
            row.classList.add("active");
            $("#activeParam").textContent = inp.label;
            if (window.building3D) window.building3D.focusFeature(inp.id);
        });
        el.addEventListener("blur", () => {
            row.classList.remove("active");
            if (window.building3D) window.building3D.unfocusFeature();
        });
    });
}

/* ============================================================
   SAMPLE / RANDOM / RESET
   ============================================================ */
const SAMPLES = [
    {
        compactness: 0.79,
        surfaceArea: 637,
        wallArea: 343,
        roofArea: 220,
        height: 3.5,
        orientation: "North",
        glazingArea: 0.15,
        glazingDist: "5 — All",
    },
    {
        compactness: 0.66,
        surfaceArea: 808,
        wallArea: 368,
        roofArea: 220,
        height: 7.0,
        orientation: "South",
        glazingArea: 0.3,
        glazingDist: "3 — South",
    },
    {
        compactness: 0.98,
        surfaceArea: 563,
        wallArea: 318,
        roofArea: 122,
        height: 7.0,
        orientation: "East",
        glazingArea: 0.25,
        glazingDist: "5 — All",
    },
    {
        compactness: 0.74,
        surfaceArea: 686,
        wallArea: 245,
        roofArea: 156,
        height: 3.5,
        orientation: "West",
        glazingArea: 0.1,
        glazingDist: "4 — West",
    },
];

export function applyValues(vals) {
    INPUTS.forEach((inp) => {
        const v = vals[inp.id];
        state[inp.id] = v;
        const el = $("#in-" + inp.id);
        if (!el) return;

        el.value = typeof v === "string" ? v : v;
        if (inp.type === "slider") {
            const valEl = $("#val-" + inp.id);
            const fillEl = $("#fill-" + inp.id);
            if (valEl) valEl.textContent = v.toFixed(inp.step < 1 ? 2 : 0);
            if (fillEl) {
                const pct = ((v - inp.min) / (inp.max - inp.min)) * 100;
                fillEl.style.width = pct + "%";
            }
        }
        if (window.building3D) window.building3D.setFeature(inp.id, v);
    });
}

if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
        const s = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
        applyValues(s);
        toast("Sample building loaded", "success");
    });
}

if (randomBtn) {
    randomBtn.addEventListener("click", () => {
        const r = {
            compactness: +(0.5 + Math.random() * 0.5).toFixed(2),
            surfaceArea: Math.floor(200 + Math.random() * 600),
            wallArea: Math.floor(150 + Math.random() * 200),
            roofArea: Math.floor(80 + Math.random() * 180),
            height: +(2.5 + Math.random() * 4.5).toFixed(1),
            orientation: ["North", "East", "South", "West"][
                Math.floor(Math.random() * 4)
            ],
            glazingArea: +(Math.random() * 0.4).toFixed(2),
            glazingDist: [
                "0 — None",
                "1 — North",
                "2 — East",
                "3 — South",
                "4 — West",
                "5 — All",
            ][Math.floor(Math.random() * 6)],
        };
        applyValues(r);
        toast("Random building generated", "info");
    });
}

if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        const defaults = {};
        INPUTS.forEach((i) => (defaults[i.id] = i.default));
        applyValues(defaults);
        toast("Fields reset to defaults", "warning");
    });
}